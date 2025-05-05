
# AutoAstra IDS Setup Instructions

## Project Structure

The project consists of two main parts:
- React frontend (in the src/ directory)
- Python backend (in the backend/ directory)

## Backend Setup

1. Create a `backend` directory at the root of the project if it doesn't exist already.

2. Copy the `ids_engine.py` file to the `backend` directory.

3. You'll need a sample CAN log file called `normal2_can.log` for the baseline model. Place this in the same `backend` directory.

4. Install the required Python dependencies:
```bash
pip install flask flask-cors
```

5. Start the backend server:
```bash
cd backend
python server.py
```

The server will start on http://localhost:5000

## Frontend Setup

1. Install the Node.js dependencies:
```bash
npm install
```

2. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## Usage

1. Make sure both the backend and frontend servers are running.

2. In the web interface, use the "Start Detection" button to begin monitoring.

3. The system will display alerts in real-time as they are detected.

4. You can view historical alerts in the Log History page.
