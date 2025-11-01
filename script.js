  // Global variables
        let soundEnabled = true;
        let lastAlertType = null;
        let alertCooldown = false;

        // Login functionality
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple authentication (in a real system, this would be server-side)
            if (username === 'admin' && password === 'admin') {
                document.getElementById('loginPage').classList.add('hidden');
                document.getElementById('dashboard').classList.remove('hidden');
                initializeDashboard();
            } else {
                document.getElementById('loginError').classList.remove('hidden');
            }
        });


        // Switch from Login → Register
document.getElementById("showRegister").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("registerPage").classList.remove("hidden");
});

// Switch from Register → Login
document.getElementById("showLogin").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("registerPage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
});


        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', function() {
            document.getElementById('dashboard').classList.add('hidden');
            document.getElementById('loginPage').classList.remove('hidden');
            document.getElementById('loginForm').reset();
            document.getElementById('loginError').classList.add('hidden');
        });

        // Sound toggle functionality
        document.getElementById('soundToggle').addEventListener('click', function() {
            soundEnabled = !soundEnabled;
            const icon = this.querySelector('i');
            if (soundEnabled) {
                icon.className = 'fas fa-volume-up';
                this.title = "Alert Sounds: ON";
                // Play a test sound when enabling
                playAlertSound('success');
            } else {
                icon.className = 'fas fa-volume-mute';
                this.title = "Alert Sounds: OFF";
            }
        });

        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and contents
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                document.getElementById(this.dataset.tab).classList.add('active');
            });
        });

        // Initialize dashboard
        function initializeDashboard() {
            // Initialize charts
            initializeCharts();
            
            // Start real-time updates
            startRealTimeUpdates();
            
            // Set up control buttons
            setupControls();
            
            // Generate initial alerts
            generateAlerts();
        }

        // Play alert sound based on type
        function playAlertSound(type) {
            if (!soundEnabled || alertCooldown) return;
            
            const audioElement = document.getElementById(`alertSound${type.charAt(0).toUpperCase() + type.slice(1)}`);
            if (audioElement) {
                audioElement.currentTime = 0;
                audioElement.play().catch(e => console.log("Audio play failed:", e));
                
                // Set cooldown to prevent sound spam
                alertCooldown = true;
                setTimeout(() => {
                    alertCooldown = false;
                }, 2000);
            }
        }

        // Initialize charts
        function initializeCharts() {
            // Water Level & Rainfall Chart
            const waterRainCtx = document.getElementById('waterRainChart').getContext('2d');
            const waterRainChart = new Chart(waterRainCtx, {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
                    datasets: [
                        {
                            label: 'Water Level (m)',
                            data: [1.2, 1.5, 1.8, 2.1, 2.3, 2.4, 2.5],
                            borderColor: '#3498db',
                            backgroundColor: 'rgba(52, 152, 219, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Rainfall (mm)',
                            data: [0, 5, 12, 8, 3, 1, 0],
                            borderColor: '#2c3e50',
                            backgroundColor: 'rgba(44, 62, 80, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Water Quality Chart
            const qualityCtx = document.getElementById('qualityChart').getContext('2d');
            const qualityChart = new Chart(qualityCtx, {
                type: 'bar',
                data: {
                    labels: ['TDS', 'pH', 'Turbidity', 'Chlorine'],
                    datasets: [{
                        label: 'Current Values',
                        data: [320, 7.2, 2.1, 0.8],
                        backgroundColor: [
                            'rgba(52, 152, 219, 0.7)',
                            'rgba(46, 204, 113, 0.7)',
                            'rgba(241, 196, 15, 0.7)',
                            'rgba(155, 89, 182, 0.7)'
                        ],
                        borderColor: [
                            'rgb(52, 152, 219)',
                            'rgb(46, 204, 113)',
                            'rgb(241, 196, 15)',
                            'rgb(155, 89, 182)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Usage Chart
            const usageCtx = document.getElementById('usageChart').getContext('2d');
            const usageChart = new Chart(usageCtx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [
                        {
                            label: 'Rainwater Used (L)',
                            data: [1850, 2200, 1950, 2100],
                            borderColor: '#3498db',
                            backgroundColor: 'rgba(52, 152, 219, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Mains Water Used (L)',
                            data: [1200, 800, 950, 700],
                            borderColor: '#e74c3c',
                            backgroundColor: 'rgba(231, 76, 60, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Source Chart
            const sourceCtx = document.getElementById('sourceChart').getContext('2d');
            const sourceChart = new Chart(sourceCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Rainwater', 'Mains Water'],
                    datasets: [{
                        data: [75, 25],
                        backgroundColor: [
                            'rgba(52, 152, 219, 0.7)',
                            'rgba(231, 76, 60, 0.7)'
                        ],
                        borderColor: [
                            'rgb(52, 152, 219)',
                            'rgb(231, 76, 60)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        }
                    }
                }
            });

            // Sensor Data Chart
            const sensorCtx = document.getElementById('sensorDataChart').getContext('2d');
            const sensorChart = new Chart(sensorCtx, {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
                    datasets: [
                        {
                            label: 'Data Points Transmitted',
                            data: [120, 115, 118, 122, 125, 119, 121],
                            borderColor: '#9b59b6',
                            backgroundColor: 'rgba(155, 89, 182, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Efficiency Chart
            const efficiencyCtx = document.getElementById('efficiencyChart').getContext('2d');
            const efficiencyChart = new Chart(efficiencyCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Collection Efficiency (%)',
                        data: [72, 68, 75, 80, 78, 82],
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgb(52, 152, 219)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });

            // Store chart references for updates
            window.waterRainChart = waterRainChart;
            window.qualityChart = qualityChart;
            window.usageChart = usageChart;
            window.sourceChart = sourceChart;
            window.sensorChart = sensorChart;
            window.efficiencyChart = efficiencyChart;
        }

        // Start real-time updates
        function startRealTimeUpdates() {
            // Update data every 5 seconds
            setInterval(updateSensorData, 5000);
            
            // Update timestamp every minute
            setInterval(updateTimestamp, 60000);
        }

        // Update sensor data with simulated values
        function updateSensorData() {
            // Simulate sensor data changes
            const waterLevel = 2.0 + Math.random() * 0.8;
            const rainfall = Math.random() * 15;
            const temperature = 22 + Math.random() * 6;
            const humidity = 60 + Math.random() * 20;
            const flowRate = 3 + Math.random() * 4;
            const tds = 250 + Math.random() * 150;
            const tankCapacity = 1000 + Math.random() * 1000;
            
            // Update display values
            document.getElementById('waterLevelValue').textContent = waterLevel.toFixed(1) + ' m';
            document.getElementById('rainfallValue').textContent = rainfall.toFixed(0) + ' mm/h';
            document.getElementById('temperatureValue').textContent = temperature.toFixed(1) + ' °C';
            document.getElementById('humidityValue').textContent = humidity.toFixed(0) + '%';
            document.getElementById('flowRateValue').textContent = flowRate.toFixed(1) + ' L/min';
            document.getElementById('tdsValue').textContent = tds.toFixed(0) + ' ppm';
            document.getElementById('tankCapacityValue').textContent = tankCapacity.toFixed(0) + ' L';
            
            // Update progress bars
            const waterLevelPercent = (waterLevel / 4) * 100;
            document.getElementById('waterLevelProgress').style.width = waterLevelPercent + '%';
            document.getElementById('waterLevelPercent').textContent = waterLevelPercent.toFixed(1) + '%';
            
            const rainfallPercent = (rainfall / 30) * 100;
            document.getElementById('rainfallProgress').style.width = rainfallPercent + '%';
            
            const tankCapacityPercent = (tankCapacity / 2000) * 100;
            document.getElementById('tankCapacityProgress').style.width = tankCapacityPercent + '%';
            
            // Update calculated values
            document.getElementById('feelsLikeValue').textContent = (temperature + (humidity / 100) * 2).toFixed(1) + '°C';
            document.getElementById('availableWater').textContent = tankCapacity.toFixed(0) + ' L';
            document.getElementById('dailyFlow').textContent = (800 + Math.random() * 500).toFixed(0) + ' L';
            document.getElementById('dailyRainfall').textContent = (30 + Math.random() * 30).toFixed(0) + ' mm';
            
            // Update water quality status
            let waterQualityStatus = 'Good';
            if (tds > 400) waterQualityStatus = 'Fair';
            if (tds > 600) waterQualityStatus = 'Poor';
            document.getElementById('waterQualityStatus').textContent = waterQualityStatus;
            
            // Update pump status based on water level
            const pumpStatus = waterLevel > 3.5 ? 'OFF' : 'ON';
            document.getElementById('pumpStatus').textContent = 'Pump: ' + pumpStatus;
            
            // Update cost savings (assuming $0.005 per liter)
            const waterSavings = 8000 + Math.random() * 3000;
            const costSavings = (waterSavings * 0.005).toFixed(2);
            document.getElementById('costSavings').textContent = '$' + costSavings;
            
            // Update CO2 reduction (assuming 0.0003 kg CO2 per liter)
            const co2Reduction = (waterSavings * 0.0003).toFixed(0);
            document.getElementById('co2Reduction').textContent = co2Reduction + ' kg';
            
            // Update charts with new data
            updateCharts(waterLevel, rainfall, tds);
            
            // Check for alerts
            checkAlerts(waterLevel, rainfall, tds, tankCapacity);
        }

        // Update charts with new data
        function updateCharts(waterLevel, rainfall, tds) {
            // Update water and rain chart
            const waterRainData = window.waterRainChart.data.datasets[0].data;
            const rainData = window.waterRainChart.data.datasets[1].data;
            
            // Shift data left and add new point
            waterRainData.shift();
            waterRainData.push(waterLevel);
            
            rainData.shift();
            rainData.push(rainfall);
            
            window.waterRainChart.update();
            
            // Update quality chart
            window.qualityChart.data.datasets[0].data[0] = tds;
            window.qualityChart.data.datasets[0].data[1] = 6.8 + Math.random() * 0.8; // pH
            window.qualityChart.data.datasets[0].data[2] = 1 + Math.random() * 3; // Turbidity
            window.qualityChart.data.datasets[0].data[3] = 0.5 + Math.random() * 0.6; // Chlorine
            
            window.qualityChart.update();
            
            // Update sensor data chart
            const sensorData = window.sensorChart.data.datasets[0].data;
            sensorData.shift();
            sensorData.push(115 + Math.random() * 10);
            window.sensorChart.update();
        }

        // Update timestamp
        function updateTimestamp() {
            const now = new Date();
            document.getElementById('lastUpdate').textContent = now.toLocaleTimeString();
        }

        // Set up control buttons
        function setupControls() {
            // Pump controls
            document.getElementById('pumpOnBtn').addEventListener('click', function() {
                alert('Pump turned ON');
                document.getElementById('pumpStatus').textContent = 'Pump: ON';
            });
            
            document.getElementById('pumpOffBtn').addEventListener('click', function() {
                alert('Pump turned OFF');
                document.getElementById('pumpStatus').textContent = 'Pump: OFF';
            });
            
            // Valve controls
            document.getElementById('valveOpenBtn').addEventListener('click', function() {
                alert('Valve opened');
                document.getElementById('valveStatus').textContent = 'OPEN';
            });
            
            document.getElementById('valveCloseBtn').addEventListener('click', function() {
                alert('Valve closed');
                document.getElementById('valveStatus').textContent = 'CLOSED';
            });
            
            // System mode
            document.getElementById('systemMode').addEventListener('change', function() {
                const mode = this.value;
                alert('System mode changed to: ' + (mode === 'auto' ? 'Automatic' : 'Manual'));
            });
            
            // Update prediction
            document.getElementById('updatePredictionBtn').addEventListener('click', function() {
                const rainOptions = ['Low probability in 12 hours', 'Medium probability in 8 hours', 'High probability in 6 hours'];
                const consumptionOptions = ['750 L today', '850 L today', '920 L today'];
                
                const rainPrediction = rainOptions[Math.floor(Math.random() * rainOptions.length)];
                const consumptionPrediction = consumptionOptions[Math.floor(Math.random() * consumptionOptions.length)];
                
                document.getElementById('rainPrediction').textContent = rainPrediction;
                document.getElementById('consumptionPrediction').textContent = consumptionPrediction;
                
                alert('Predictions updated!');
            });
        }

        // Generate initial alerts
        function generateAlerts() {
            const alertsContainer = document.getElementById('alertsContainer');
            
            // Clear existing alerts
            alertsContainer.innerHTML = '';
            
            // Add sample alerts
            const alerts = [
                { type: 'success', message: 'System operating normally' },
                { type: 'warning', message: 'Water level approaching maximum capacity' },
                { type: 'success', message: 'All IoT sensors connected and transmitting data' }
            ];
            
            alerts.forEach(alert => {
                const alertElement = document.createElement('div');
                alertElement.className = `alert alert-${alert.type}`;
                alertElement.innerHTML = `
                    <i class="fas fa-${alert.type === 'success' ? 'check-circle' : alert.type === 'warning' ? 'exclamation-triangle' : 'users'}"></i>
                    <span>${alert.message}</span>
                `;
                alertsContainer.appendChild(alertElement);
            });
        }

        // Check for alert conditions
        function checkAlerts(waterLevel, rainfall, tds, tankCapacity) {
            const alertsContainer = document.getElementById('alertsContainer');
            
            // Clear existing alerts
            alertsContainer.innerHTML = '';
            
            const alerts = [];
            
            // Check water level alerts
            if (waterLevel > 3.5) {
                alerts.push({ type: 'danger', message: 'Tank is full! Pump has been automatically turned off.' });
            } else if (waterLevel < 0.5) {
                alerts.push({ type: 'danger', message: 'Water level is critically low!' });
            } else if (waterLevel > 3.0) {
                alerts.push({ type: 'warning', message: 'Water level approaching maximum capacity' });
            }
            
            // Check rainfall alerts
            if (rainfall > 20) {
                alerts.push({ type: 'warning', message: 'Heavy rainfall detected' });
            }
            
            // Check water quality alerts
            if (tds > 600) {
                alerts.push({ type: 'danger', message: 'TDS levels above recommended threshold' });
            } else if (tds > 400) {
                alerts.push({ type: 'warning', message: 'TDS levels approaching maximum threshold' });
            }
            
            // Check tank capacity
            if (tankCapacity > 1800) {
                alerts.push({ type: 'warning', message: 'Tank capacity nearly full' });
            }
            
            // If no alerts, show normal status
            if (alerts.length === 0) {
                alerts.push({ type: 'success', message: 'System operating normally' });
            }
            
            // Play sound for the highest priority alert
            const alertTypes = alerts.map(a => a.type);
            if (alertTypes.includes('danger')) {
                playAlertSound('danger');
            } else if (alertTypes.includes('warning')) {
                playAlertSound('warning');
            } else if (alertTypes.includes('success') && lastAlertType !== 'success') {
                playAlertSound('success');
            }
            
            // Update last alert type
            if (alerts.length > 0) {
                lastAlertType = alerts[0].type;
            }
            
            // Display alerts
            alerts.forEach(alert => {
                const alertElement = document.createElement('div');
                alertElement.className = `alert alert-${alert.type}`;
                alertElement.innerHTML = `
                    <i class="fas fa-${alert.type === 'success' ? 'check-circle' : alert.type === 'warning' ? 'exclamation-triangle' : 'exclamation-circle'}"></i>
                    <span>${alert.message}</span>
                `;
                alertsContainer.appendChild(alertElement);
            });
        }

        
        
document.getElementById("downloadDataBtn").addEventListener("click", () => {
    const format = document.getElementById("exportFormat").value;
    const range = document.getElementById("dateRange").value;

    // Sample data (you can replace with real IoT data)
    const data = [
        { date: "2025-10-25", usage: 120, tankLevel: 85 },
        { date: "2025-10-26", usage: 140, tankLevel: 78 },
        { date: "2025-10-27", usage: 100, tankLevel: 90 },
    ];

    if (format === "json") {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        downloadFile(blob, `data_${range}days.json`);
    } 
    else if (format === "csv") {
        const csv = convertToCSV(data);
        const blob = new Blob([csv], { type: "text/csv" });
        downloadFile(blob, `data_${range}days.csv`);
    } 
    else if (format === "pdf") {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Smart Rainwater Harvesting - Data Report", 10, 10);
        doc.text(`Date Range: Last ${range} days`, 10, 20);
        doc.text("------------------------------------------------", 10, 30);
        data.forEach((d, i) => {
            doc.text(`${i + 1}. Date: ${d.date}, Usage: ${d.usage}L, Tank Level: ${d.tankLevel}%`, 10, 40 + i * 10);
        });
        doc.save(`data_${range}days.pdf`);
    }
});

function convertToCSV(arr) {
    const keys = Object.keys(arr[0]);
    const header = keys.join(",") + "\n";
    const rows = arr.map(obj => keys.map(k => obj[k]).join(",")).join("\n");
    return header + rows;
}

function downloadFile(blob, filename) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}