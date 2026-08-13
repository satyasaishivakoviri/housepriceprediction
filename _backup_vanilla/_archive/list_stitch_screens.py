import subprocess
import json
import sys
import os

def list_screens():
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

    # tools/call list_screens
    # projectId should be the full resource name or just the ID? 
    # The logs showed "name": "projects/11060188023459959450". 
    # Tool def says "projectId" (string). Let's try the full "projects/..." string first as typically google apis work that way, or just the number. 
    # Looking at previous output "name": "projects/11060188023459959450".
    # The tool definition for list_screens Input says: "projectId: Required. Identifier. The project ID to list screens for."
    # Often for these newer APIs it might just be the number if the field is named projectId, but let's try the full name from the previous list output first to be safe, or I'll try just the number if that fails.
    # Wait, the `get_project` input said: "name (string - MANDATORY): ... format projects/{project_id}".
    # `list_screens` says "projectId". Let's assume it accepts the full resource name or tries to parse it. 
    # Actually, let's look at the previous output "name" field: "projects/11060188023459959450".
    
    call_req = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": "list_screens",
            "arguments": {
                "projectId": "projects/11060188023459959450"
            }
        }
    }
    
    print(f"Calling list_screens...", file=sys.stderr)
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
                # Write to file
                with open("screens.json", "w") as f:
                    json.dump(msg, f, indent=2)
                break
            if "error" in msg:
                 print(f"Error: {msg['error']}", file=sys.stderr)
                 break
        except json.JSONDecodeError:
            continue

    process.terminate()

if __name__ == "__main__":
    list_screens()
