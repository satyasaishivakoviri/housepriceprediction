import subprocess
import json
import sys
import os

def check_projects():
    process = subprocess.Popen(
        "npx -y @_davideast/stitch-mcp proxy",
        shell=True,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=sys.stderr,
        text=True,
        bufsize=0
    )

    # Init
    init_request = {
        "jsonrpc": "2.0",
        "id": 0,
        "method": "initialize",
        "params": {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "manual-script", "version": "1.0"}
        }
    }
    
    process.stdin.write(json.dumps(init_request) + "\n")
    process.stdin.flush()

    # Read init response
    while True:
        line = process.stdout.readline()
        if not line:
            break
        try:
            msg = json.loads(line)
            if msg.get("id") == 0:
                # Send initialized
                process.stdin.write(json.dumps({
                    "jsonrpc": "2.0",
                    "method": "notifications/initialized"
                }) + "\n")
                process.stdin.flush()
                break
        except json.JSONDecodeError:
            continue

    # Call tools/call for list_projects. 
    # Wait, looking at the JSON, "list_projects" is a TOOL. 
    # So I must use "tools/call" method with name="list_projects".
    
    call_req = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": "list_projects",
            "arguments": {}
        }
    }
    
    print(f"Calling list_projects...", file=sys.stderr)
    process.stdin.write(json.dumps(call_req) + "\n")
    process.stdin.flush()

    # Read response
    while True:
        line = process.stdout.readline()
        if not line:
            break
        try:
            msg = json.loads(line)
            if msg.get("id") == 1:
                # Print nicely to stderr
                if "result" in msg and "content" in msg["result"]:
                     # The content usually contains text or embedded resources
                     for item in msg["result"]["content"]:
                         if item.get("type") == "text":
                             try:
                                 # The tool usually returns a JSON string inside the text content?
                                 # Or maybe it returns a descriptive text.
                                 # Let's just print the raw text content for now.
                                 print(item["text"], file=sys.stderr)
                                 
                                 # Try to parse if it's JSON
                                 data = json.loads(item["text"])
                                 print("Parsed Projects:", file=sys.stderr)
                                 if "projects" in data:
                                     for p in data["projects"]:
                                         print(f"Project: {p.get('title','No Title')} ({p['name']})", file=sys.stderr)
                             except:
                                 pass
                
                # Also dump full JSON just in case
                print(json.dumps(msg, indent=2))
                break
            if "error" in msg:
                 print(f"Error: {msg['error']}", file=sys.stderr)
                 break
        except json.JSONDecodeError:
            continue

    process.terminate()

if __name__ == "__main__":
    check_projects()
