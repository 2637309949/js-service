const fs = require("fs")
const kleur = require("kleur")
const path = require("path")
const _ = require("lodash")
const { 
    Middlewares
} = require('moleculer')
const alias = require("../alias")
const { clearRequireCache, uniq } = require("../util")

function hotReloadMiddleware(broker) {
	const cache = new Map()

	let projectFiles = new Map()
	let prevProjectFiles = new Map()

	function hotReloadService(service) {
		const relPath = path.relative(process.cwd(), service.__filename)
		broker.logger.info(`Hot reload '${service.name}' service...`, kleur.grey(relPath))
		return broker.destroyService(service).then(() => {
			if (fs.existsSync(service.__filename)) {
				try {
					return broker.loadService(service.__filename)
				} catch (err) {
					broker.logger.error(`Failed to load service '${service.__filename}'`, err)
					clearRequireCache(service.__filename)
				}
			}
		})
	}

	/**
	 * Detect service dependency graph & watch all dependent files & services.
	 *
	 */
	function watchProjectFiles() {
		if (!broker.started || (!process.mainModule && !require.main)) return

		cache.clear()
		prevProjectFiles = projectFiles
		projectFiles = new Map()

		// Read the main module
		// const mainModule = process.mainModule || require.main
        const moduleRequires = [...alias.moduleRequires]
		moduleRequires.push(require.main.filename)
		// Process the whole module tree
		// processModule(mainModule, null, 0, null)
		processModuleRequires(moduleRequires)

		const needToReload = new Set()

		// Debounced Service reloader function
		const reloadServices = _.debounce(() => {
			const needToReloadDedup = _.uniqWith([...needToReload], (a, b) => {
				const ac = typeof a == "string" ? a : a.__filename
				const bc = typeof b == "string" ? b : b.__filename
				return ac == bc
			})

			broker.logger.info(
				kleur.bgMagenta().white().bold(`Reload ${needToReloadDedup.length} service(s)`)
			)

			needToReloadDedup.forEach(svc => {
				if (typeof svc == "string")
					if (fs.existsSync(svc)) return broker.loadService(svc)
					else return

				return hotReloadService(svc)
			})
			needToReload.clear()
		}, 500)

		// Close previous watchers
		stopAllFileWatcher(prevProjectFiles)

		// Watching project files
		broker.logger.debug("")
		broker.logger.debug(kleur.yellow().bold("Watching the following project files:"))

		projectFiles.forEach((watchItem, fName) => {
			// Delete if file doesn't exist anymore
			if (!fs.existsSync(fName)) projectFiles.delete(fName)
		})

		projectFiles.forEach((watchItem, fName) => {
			const relPath = path.relative(process.cwd(), fName)
			if (watchItem.brokerRestart)
				broker.logger.debug(`  ${relPath}:`, kleur.grey("restart broker."))
			else if (watchItem.allServices)
				broker.logger.debug(`  ${relPath}:`, kleur.grey("reload all services."))
			else if (watchItem.services.length > 0) {
				broker.logger.debug(
					`  ${relPath}:`,
					kleur.grey(
						`reload ${watchItem.services.length} service(s) & ${watchItem.others.length} other(s).`
					) /*, watchItem.services, watchItem.others*/
				)
				watchItem.services.forEach(svcFullname =>
					broker.logger.debug(kleur.grey(`    ${svcFullname}`))
				)
				watchItem.others.forEach(filename =>
					broker.logger.debug(kleur.grey(`    ${path.relative(process.cwd(), filename)}`))
				)
			}
			// Create watcher
			watchItem.watcher = fs.watch(fName, eventType => {
				const relPath = path.relative(process.cwd(), fName)
				broker.logger.info(
					kleur.magenta().bold(`The '${relPath}' file is changed. (Event: ${eventType})`)
				)

				// Clear from require cache
				clearRequireCache(fName)
				if (watchItem.others.length > 0) {
					watchItem.others.forEach(f => clearRequireCache(f))
				}

				if (
					watchItem.brokerRestart 
				) {
					broker.logger.info(kleur.bgMagenta().white().bold("Action: Restart broker..."))
					stopAllFileWatcher(projectFiles)
					// Clear the whole require cache
					Object.keys(require.cache).forEach(key => delete require.cache[key])

                    if (broker.started) {
                        broker
                        .stop()
                        .catch(err => {
                            broker.logger.error("Error while stopping ServiceBroker", err)
                        })
                        .then(() => {
                            try {
                                delete require.cache[require.main.filename]
                                require(require.main.filename) 
                            } catch (err) {
                                broker.logger.error("Error while starting ServiceBroker", err)
                            }
                        })
                    } else {
                        broker
                        .start()
                        .catch(err => {
                            broker.logger.error("Error while stopping ServiceBroker", err)
                        })
                    }
				} else if (watchItem.allServices) {
					// Reload all services
					broker.services.forEach(svc => {
						if (svc.__filename) needToReload.add(svc)
					})
					reloadServices()
				} else if (watchItem.services.length > 0) {
					// Reload certain services
					broker.services.forEach(svc => {
						if (watchItem.services.indexOf(svc.fullName) !== -1) needToReload.add(svc)
					})

					if (needToReload.size == 0) {
						// It means, it's a crashed reloaded service, so we
						// didn't find it in the loaded services because
						// the previous hot-reload failed. We should load it
						// broker.loadService
						needToReload.add(relPath)
					}
					reloadServices()
				}
			})
		})

		if (projectFiles.size == 0) broker.logger.debug(kleur.grey("  No files."))
	}

	/**
	 * Stop all file watchers
	 */
	function stopAllFileWatcher(items) {
		items.forEach(watchItem => {
			if (watchItem.watcher) {
				watchItem.watcher.close()
				watchItem.watcher = null
			}
		})
	}

	/**
	 * Get a watch item
	 *
	 * @param {String} fName
	 * @returns {Object}
	 */
	function getWatchItem(fName) {
		let watchItem = projectFiles.get(fName)
		if (watchItem) return watchItem

		watchItem = {
			services: [],
			allServices: false,
			brokerRestart: false,
			others: []
		}
		projectFiles.set(fName, watchItem)

		return watchItem
	}

	function isMoleculerConfig(fName) {
		return (
			fName.endsWith("moleculer.config.js") ||
			fName.endsWith("moleculer.config.ts") ||
			fName.endsWith("moleculer.config.json")
		)
	}

	/**
	 * Process module children modules.
	 *
	 * @param {*} mod
	 * @param {*} service
	 * @param {Number} level
	 */
	function processModule(mod, service = null, level = 0, parents = null) {
		const fName = mod.filename

		// Avoid circular dependency in project files
		if (parents && parents.indexOf(fName) !== -1) return

		// console.log(fName)

		// Cache files to avoid cyclic dependencies in node_modules
		if (fName.indexOf("node_modules") !== -1) {
			if (cache.get(fName)) return
			cache.set(fName, mod)
		}

		if (!service) {
			service = broker.services.find(svc => svc.__filename == fName)
		}

		if (service) {
			// It is a service dependency. We should reload this service if this file has changed.
			const watchItem = getWatchItem(fName)
			if (!watchItem.services.includes(service.fullName)) {
				watchItem.services.push(service.fullName)
			}

			watchItem.others = uniq([...watchItem.others, ...(parents || [])])
		} else if (isMoleculerConfig(fName)) {
			const watchItem = getWatchItem(fName)
			watchItem.brokerRestart = true
		} else {
			// It is not a service dependency, it is a global middleware. We should reload all services if this file has changed.
			if (parents) {
				const watchItem = getWatchItem(fName)
				watchItem.brokerRestart = true
				watchItem.others = uniq([...watchItem.others, ...(parents || [])])
			}
		}

		if (mod.children && mod.children.length > 0) {
			if (service) {
				parents = parents ? parents.concat([fName]) : [fName]
			} else if (isMoleculerConfig(fName)) {
				parents = []
				// const watchItem = getWatchItem(fName)
				// watchItem.brokerRestart = true
			} else if (parents) {
				parents.push(fName)
			}
			mod.children.forEach(m => processModule(m, service, service ? level + 1 : 0, parents))
		}
	}

    function processModuleRequires(moduleRequires) {
        moduleRequires.forEach(fName => {
            const watchItem = getWatchItem(fName)
            watchItem.brokerRestart = true
        })
    }

	/**
	 * Expose middleware
	 */
	return {
		name: "HotReload",
		// After broker started
		started(broker) {
			if (broker.options.hotReload == null) {
				return
			} else if (broker.options.hotReload !== true) {
				return
			}

			watchProjectFiles()
		}
	}
}

function replaceHotReload () {
	Middlewares.HotReload = hotReloadMiddleware
}

module.exports.hotReloadMiddleware = hotReloadMiddleware
module.exports.replaceHotReload = replaceHotReload
