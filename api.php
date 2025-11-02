<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// XAMPP Database Configuration
$host = 'localhost';
$dbname = 'rainwater harvesting';
$username = 'root';
$password = '';  // XAMPP में default password blank होता है

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Preflight request handle करें
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];

// PATH_INFO के बजाय REQUEST_URI use करें
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$request = explode('/', trim($path, '/'));
$endpoint = $request[count($request)-1]; // Last part of URL

$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'POST':
        // Login endpoint
        if($endpoint == 'login') {
            $username = $input['username'] ?? '';
            $password = $input['password'] ?? '';
            
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // For testing: password is "password"
            if($user && password_verify($password, $user['password'])) {
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'full_name' => $user['full_name']
                    ]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
            }
        }
        
        // Save sensor data endpoint
        elseif($endpoint == 'sensor-data') {
            $stmt = $pdo->prepare("INSERT INTO sensor_data (water_level, rainfall, temperature, humidity, flow_rate, tds, ph_level, tank_capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['water_level'] ?? 0,
                $input['rainfall'] ?? 0,
                $input['temperature'] ?? 0,
                $input['humidity'] ?? 0,
                $input['flow_rate'] ?? 0,
                $input['tds'] ?? 0,
                $input['ph_level'] ?? 7.0,
                $input['tank_capacity'] ?? 0
            ]);
            
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        }
        
        // Save water usage endpoint
        elseif($endpoint == 'water-usage') {
            $stmt = $pdo->prepare("INSERT INTO water_usage (date, rainwater_used, mains_water_used) VALUES (?, ?, ?)");
            $stmt->execute([
                $input['date'] ?? date('Y-m-d'),
                $input['rainwater_used'] ?? 0,
                $input['mains_water_used'] ?? 0
            ]);
            
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        }
        break;
        
    case 'GET':
        // Get latest sensor data
        if($endpoint == 'sensor-data') {
            $stmt = $pdo->prepare("SELECT * FROM sensor_data ORDER BY recorded_at DESC LIMIT 1");
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode(['success' => true, 'data' => $data]);
        }
        
        // Get sensor data history
        elseif($endpoint == 'sensor-history') {
            $limit = $_GET['limit'] ?? 24;
            $stmt = $pdo->prepare("SELECT * FROM sensor_data ORDER BY recorded_at DESC LIMIT ?");
            $stmt->execute([$limit]);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(['success' => true, 'data' => $data]);
        }
        
        // Get water usage data
        elseif($endpoint == 'water-usage') {
            $days = $_GET['days'] ?? 30;
            $stmt = $pdo->prepare("SELECT * FROM water_usage ORDER BY date DESC LIMIT ?");
            $stmt->execute([$days]);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(['success' => true, 'data' => $data]);
        }
        
        // Get system settings
        elseif($endpoint == 'system-settings') {
            $stmt = $pdo->prepare("SELECT * FROM system_settings ORDER BY id DESC LIMIT 1");
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode(['success' => true, 'data' => $data]);
        }
        break;
        
    case 'PUT':
        // Update system settings
        if($endpoint == 'system-settings') {
            $fields = [];
            $values = [];
            
            foreach($input as $key => $value) {
                $fields[] = "$key = ?";
                $values[] = $value;
            }
            
            if(!empty($fields)) {
                $sql = "UPDATE system_settings SET " . implode(', ', $fields) . " WHERE id = 1";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($values);
                
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'No fields to update']);
            }
        }
        break;
        
    default:
        echo json_encode(['error' => 'Method not supported']);
        break;
}
?>