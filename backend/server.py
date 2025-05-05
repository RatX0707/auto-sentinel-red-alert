
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
import signal
import threading
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Store the process ID of the running ids_engine.py
process = None
log_reader_thread = None
log_file_path = "ids_alerts.log"
should_monitor = False

def create_empty_log_file():
    """Create an empty log file if it doesn't exist."""
    if not os.path.exists(log_file_path):
        with open(log_file_path, "w") as f:
            f.write("")

def monitor_log_file():
    """Monitor the log file for new alerts."""
    global should_monitor
    
    # Note: In a real implementation, you might want to use websockets
    # to send real-time alerts to the frontend. This is just a placeholder.
    last_position = 0
    while should_monitor:
        if os.path.exists(log_file_path):
            with open(log_file_path, "r") as f:
                f.seek(last_position)
                new_content = f.read()
                if new_content:
                    print(f"New alerts: {new_content}")
                last_position = f.tell()
        time.sleep(1)

@app.route('/start_detection', methods=['POST'])
def start_detection():
    global process, log_reader_thread, should_monitor
    
    if process is not None:
        return jsonify({"status": "error", "message": "Detection is already running"}), 400
    
    try:
        # Get script path and log file from request
        data = request.json
        script_path = data.get('script_path', './ids_engine.py')
        log_file = data.get('log_file', './normal2_can.log')
        
        # Ensure log files directory exists
        create_empty_log_file()
        
        # Start the ids_engine.py script
        # Note: In a real implementation, you would need to provide CAN data to stdin
        # This is a simplified example
        process = subprocess.Popen(
            ["python3", script_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Start monitoring log file in a separate thread
        should_monitor = True
        log_reader_thread = threading.Thread(target=monitor_log_file)
        log_reader_thread.daemon = True
        log_reader_thread.start()
        
        return jsonify({"status": "success", "message": "Detection started successfully"}), 200
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/stop_detection', methods=['POST'])
def stop_detection():
    global process, should_monitor
    
    if process is None:
        return jsonify({"status": "error", "message": "No detection is currently running"}), 400
    
    try:
        # Terminate the process gracefully
        process.terminate()
        process.wait(timeout=5)
        process = None
        
        # Stop log file monitoring
        should_monitor = False
        
        return jsonify({"status": "success", "message": "Detection stopped successfully"}), 200
    
    except Exception as e:
        # Force kill if graceful termination fails
        if process:
            try:
                process.kill()
                process = None
            except:
                pass
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/get_alerts', methods=['GET'])
def get_alerts():
    """Get alerts from the log file."""
    if not os.path.exists(log_file_path):
        return jsonify({"alerts": []}), 200
    
    try:
        with open(log_file_path, "r") as f:
            lines = f.readlines()
        
        alerts = []
        for line in lines:
            line = line.strip()
            if line:
                # Parse the alert line
                # Format: [timestamp] [ALERT] type - message
                parts = line.split(' ', 2)
                if len(parts) >= 3:
                    timestamp = parts[0].strip('[]')
                    alert_type = "Unknown"
                    message = parts[2]
                    
                    if "Replay Attack" in message:
                        alert_type = "Replay Attack Detected"
                    elif "Unknown CAN ID" in message:
                        alert_type = "Unknown CAN ID Detected"
                    elif "Unexpected payload" in message:
                        alert_type = "Unexpected Payload Detected"
                    elif "DoS suspected" in message:
                        alert_type = "DoS Suspected"
                    
                    # Extract CAN ID if present
                    can_id = "Unknown"
                    if "ID " in message:
                        can_id_parts = message.split("ID ", 1)
                        if len(can_id_parts) > 1:
                            can_id = can_id_parts[1].split(" ", 1)[0]
                            can_id = can_id.strip(":")
                    
                    alerts.append({
                        "timestamp": timestamp,
                        "type": alert_type,
                        "message": message,
                        "canId": can_id
                    })
        
        return jsonify({"alerts": alerts}), 200
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
