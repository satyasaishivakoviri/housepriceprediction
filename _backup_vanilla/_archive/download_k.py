import subprocess
import json
import os

# Map Screen Titles (or parts of them) to Target Filenames
screens_to_download = {
    "Property Details & Contact": "details.html",
    "List Your Property": "list_property.html",
    "AI Real Estate Assistant": "assistant.html",
    "How It Works & Footer": "about.html"
}

def download_screens():
    # Read the screens.json file
    with open('screens.json', 'r') as f:
        data = json.load(f)
    
    if "result" in data and "content" in data["result"]:
        content_block = data["result"]["content"][0]
        if "text" in content_block:
             parsed_screens = json.loads(content_block["text"])
             if "screens" in parsed_screens:
                 for screen in parsed_screens["screens"]:
                     title = screen.get("title")
                     if title in screens_to_download:
                         target_file = screens_to_download[title]
                         if "htmlCode" in screen and "downloadUrl" in screen["htmlCode"]:
                             url = screen["htmlCode"]["downloadUrl"]
                             print(f"Downloading {title} to {target_file}...")
                             
                             # Use curl to download
                             subprocess.run(["curl", "-o", target_file, url], check=True)

if __name__ == "__main__":
    download_screens()
