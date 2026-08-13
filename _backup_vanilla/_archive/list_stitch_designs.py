import subprocess
import json
import sys
import os

def list_tools():
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

    # List tools
    tools_req = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/list"
    }
    
    process.stdin.write(json.dumps(tools_req) + "\n")
    process.stdin.flush()

    # Read response
    while True:
        line = process.stdout.readline()
        if not line:
            break
        try:
            msg = json.loads(line)
            if msg.get("id") == 1:
                # Write full response to file
                with open("tools_output.json", "w") as f:
                    json.dump(msg, f, indent=2)
                
                # Print clean summary to stderr
                if "result" in msg and "tools" in msg["result"]:
                    for tool in msg["result"]["tools"]:
                        print(f"TOOL: {tool['name']} - {tool.get('description', 'No description')}", file=sys.stderr)
                break
        except json.JSONDecodeError:
            continue

    process.terminate()

if __name__ == "__main__":
    list_tools()
