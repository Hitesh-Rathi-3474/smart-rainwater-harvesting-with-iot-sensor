<!DOCTYPE html>
<html>
<head>
    <title>Rainwater API Test</title>
</head>
<body>
    <h2>API Testing</h2>
    
    <button onclick="testConnection()">Test Database Connection</button>
    <button onclick="getSensorData()">Get Sensor Data</button>
    
    <div id="result"></div>

    <script>
        async function testConnection() {
            try {
                const response = await fetch('http://localhost/rainwater_api.php?endpoint=sensor-data');
                const data = await response.json();
                document.getElementById('result').innerHTML = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('result').innerHTML = 'Error: ' + error;
            }
        }

        async function getSensorData() {
            try {
                const response = await fetch('http://localhost/rainwater_api.php?endpoint=sensor-history&limit=5');
                const data = await response.json();
                document.getElementById('result').innerHTML = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('result').innerHTML = 'Error: ' + error;
            }
        }
    </script>
</body>
</html>