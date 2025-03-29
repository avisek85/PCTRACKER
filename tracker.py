import time
import json
import os
import platform
import signal

# Import system-specific window tracking modules
if platform.system() == "Windows":
    import pygetwindow as gw
else:
    import subprocess

# Global flag for stopping the script
stop_tracking = False

# JSON file to store data
JSON_FILE = "usage_data.json"

def signal_handler(sig, frame):
    """Handles termination signal to stop tracking."""
    global stop_tracking
    print("\n[INFO] Stopping activity tracker...")
    stop_tracking = True
    save_to_json(usage_data)  # Save final data before exiting

# Register signal handler for Ctrl+C
signal.signal(signal.SIGINT, signal_handler)

def get_active_window():
    """Returns the currently active window title."""
    if platform.system() == "Windows":
        window = gw.getActiveWindow()
        return window.title if window else "Unknown"
    elif platform.system() == "Linux":
        output = subprocess.run(["xdotool", "getactivewindow", "getwindowname"], capture_output=True, text=True)
        return output.stdout.strip()
    elif platform.system() == "Darwin":  # macOS
        output = subprocess.run(["osascript", "-e", 'tell application "System Events" to get name of (processes whose frontmost is true)'], capture_output=True, text=True)
        return output.stdout.strip()
    return "Unknown"

def load_existing_data():
    """Loads existing data from the JSON file if it exists."""
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, "r") as file: 
# The with statement ensures that the file is automatically closed after reading.
            return json.load(file)
    return {}

def save_to_json(data):
    """Saves the collected data to a JSON file."""
    with open(JSON_FILE, "w") as file:
        json.dump(data, file, indent=4)
# indent=4 ensures the JSON file is pretty-printed (formatted with indentation for readability).
    print("[INFO] Data saved to JSON file.")

def track_usage(duration=300):
    """Tracks active application usage for the given duration (default: 5 minutes)."""
    global usage_data
    usage_data = load_existing_data()

    print("[INFO] Tracking started. Press Ctrl+C to stop.")

    start_time = time.time()
    while time.time() - start_time < duration and not stop_tracking:
        active_window = get_active_window()

        if active_window:
            if active_window not in usage_data:
                usage_data[active_window] = 0
            usage_data[active_window] += 1  # Increase by 1 second

        time.sleep(1)  # Collect every second

    save_to_json(usage_data)
    print("[INFO] Tracking session ended.")

def generate_report():
    """Generates and displays app usage report from JSON file."""
    data = load_existing_data()

    print("\n==== App Usage Report ====")
    for app, duration in sorted(data.items(), key=lambda x: x[1], reverse=True):
        print(f"{app}: {duration} seconds")

if __name__ == "__main__":
    try:
        track_usage(600)  # Track for 10 minutes
        generate_report()
    except KeyboardInterrupt:
        save_to_json(usage_data)
        print("\n[INFO] Tracking manually stopped.")


# 6️⃣ Possible Enhancements
# Want to improve it? I can add:
# 1️⃣ Auto-run on startup (Windows/Linux)?
# 2️⃣ CSV export for better analysis?
# 3️⃣ Real-time alerts when using an app for too long?
