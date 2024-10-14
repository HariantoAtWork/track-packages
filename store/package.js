import { defineStore } from 'pinia'

const couriers = ['FedEx', 'UPS', 'USPS', 'DHL', 'Amazon Logistics', 'OnTrac', 'LaserShip']
const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
const statusUpdates = [
  'Order received',
  'Package processed',
  'In transit',
  'Out for delivery',
  'Delivered'
]

export const usePackageStore = defineStore('package', {
  state: () => ({
    packages: []
  }),
  actions: {
    addPackage(trackingId, customName) {
      const newPackage = {
        id: Date.now(),
        trackingId,
        customName,
        courier: couriers[Math.floor(Math.random() * couriers.length)],
        status: 'In Transit',
        updates: [
          {
            status: 'Order received',
            location: locations[Math.floor(Math.random() * locations.length)],
            timestamp: new Date().toISOString()
          }
        ]
      }
      this.packages.push(newPackage)
      this.saveToLocalStorage()
      this.simulateUpdates(newPackage.id)
    },
    simulateUpdates(id) {
      const pkg = this.packages.find(p => p.id === id)
      if (!pkg) return

      let updateIndex = 1
      const updateInterval = setInterval(() => {
        if (updateIndex < statusUpdates.length) {
          pkg.updates.push({
            status: statusUpdates[updateIndex],
            location: locations[Math.floor(Math.random() * locations.length)],
            timestamp: new Date().toISOString()
          })
          pkg.status = statusUpdates[updateIndex]
          updateIndex++
          this.saveToLocalStorage()
        } else {
          clearInterval(updateInterval)
        }
      }, 10000) // Update every 10 seconds for demonstration purposes
    },
    updatePackageName(id, newName) {
      const pkg = this.packages.find(p => p.id === id)
      if (pkg) {
        pkg.customName = newName
        this.saveToLocalStorage()
      }
    },
    updatePackageCourier(id, newCourier) {
      const pkg = this.packages.find(p => p.id === id)
      if (pkg) {
        pkg.courier = newCourier
        // Reset updates when courier changes
        pkg.updates = [{
          status: 'Order received',
          location: locations[Math.floor(Math.random() * locations.length)],
          timestamp: new Date().toISOString()
        }]
        pkg.status = 'In Transit'
        this.saveToLocalStorage()
        this.simulateUpdates(id)
      }
    },
    getCouriers() {
      return couriers
    },
    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('packages', JSON.stringify(this.packages))
      }
    },
    loadFromLocalStorage() {
      if (process.client) {
        const savedPackages = localStorage.getItem('packages')
        if (savedPackages) {
          this.packages = JSON.parse(savedPackages)
          // Restart simulations for packages that are not delivered
          this.packages.forEach(pkg => {
            if (pkg.status !== 'Delivered') {
              this.simulateUpdates(pkg.id)
            }
          })
        }
      }
    }
  }
})