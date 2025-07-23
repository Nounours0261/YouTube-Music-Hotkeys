import sys
import struct
import json
import keyboard
import datetime
import time

def send_message(message):
    data = json.dumps(message).encode('utf-8')
    length = struct.pack('I', len(data))
    sys.stdout.buffer.write(length)
    sys.stdout.buffer.write(data)
    sys.stdout.buffer.flush()

def send_play_pause():
    send_message({ "command": "play-pause" })

def send_next():
    send_message({ "command": "next" })

def send_previous():
    send_message({ "command": "previous" })

if __name__ == "__main__":
    keyboard.add_hotkey('alt+f', send_play_pause, suppress=True)
    keyboard.add_hotkey('alt+d', send_previous, suppress=True)
    keyboard.add_hotkey('alt+g', send_next, suppress=True)
    while True:
        before = datetime.datetime.now()
        time.sleep(5)
        after = datetime.datetime.now()
        if (after - before).total_seconds() >= 6:
            send_message({"action": "restart"})