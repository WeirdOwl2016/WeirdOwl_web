const cluster = require('cluster')
let clusterNum = 0
let server = require('./main')
if (process.env.NODE_ENV === 'production') {
  if (cluster.isMaster) {
    let numCPUs = require('os').cpus()
    numCPUs.map(() => {
      cluster.fork()
    })
    cluster.on('listening', (worker, address) => {
      // console.log(`[master]listening: worker${worker.id},pid:${worker.process.pid}, Address:${address.address}:${address.port}`)
      clusterNum++
      if (clusterNum === numCPUs.length) { console.log('projrct start！') }
    })
    cluster.on('exit', (worker, code, signal) => {
      setTimeout(function () { cluster.fork() }, 2000)
    })
  } else if (cluster.isWorker) {
    server()
  }
} else {
  server()
}