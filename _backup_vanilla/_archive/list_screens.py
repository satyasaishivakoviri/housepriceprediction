import json

try:
    with open('screens.json', 'r') as f:
        data = json.load(f)
    
    # Handle different JSON structures based on how it was saved
    if "result" in data and "content" in data["result"]:
        content_block = data["result"]["content"][0]
        if "text" in content_block:
             parsed_screens = json.loads(content_block["text"])
             screens = parsed_screens.get("screens", [])
    elif "screens" in data:
        screens = data["screens"]
    else:
        # Fallback: try to find a list in the root
        screens = []
        if isinstance(data, list):
            screens = data
        elif isinstance(data, dict):
            for k, v in data.items():
                if isinstance(v, list) and len(v) > 0 and "title" in v[0]:
                    screens = v
                    break

    print(f"Found {len(screens)} screens:")
    for screen in screens:
        print(f"- {screen.get('title', 'Untitled')}")

except Exception as e:
    print(f"Error reading screens.json: {e}")
