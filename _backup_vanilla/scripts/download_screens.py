import json
import urllib.request
import os

filename_map = {
    # Core Flow
    "Animated HomieNest Auth Experience": "login.html",
    "HomieNest Desktop Home": "index.html",
    "Neighborhood Explorer Guide": "neighborhood_guide.html",
    "Affordability & EMI Planner": "affordability_planner.html",
    "Legal & Compliance Center": "legal.html",
    "Interactive Map Dashboard": "map_interactive.html",
    "Marketplace Listings Feed": "listings.html",
    "New Launches & Projects": "new_launches.html",
    "Property Details (White-Blue) Refresh": "details.html",
    "AI Price Predictor": "predictor.html",
    "Prediction Results Dashboard": "results.html",
    "XAI Price Breakdown Dashboard": "xai_breakdown.html",
    "User Activity Dashboard": "user_dashboard.html",
    "Advanced Analytics Pro Mode": "analytics.html",
    "Pro Investment Comparison Report": "pro_report.html",
    "AI Real Estate Assistant": "assistant.html",
    
    # Legacy/Variants (Keep for safety)
    "Home & Prediction Form": "index_legacy.html",
    "Price Prediction Results": "results_legacy.html",
    "List Your Property": "list_property.html",
    "Real Estate Listings Feed": "listings_legacy.html",
    "Property Details & Contact": "details_legacy.html",
    "Chat & Notifications": "chat.html",
    "How It Works & Footer": "about.html",
    "House Predictor Variant 1": "variant_1.html",
    "House Predictor Variant 2": "variant_2.html",
    "House Predictor Variant 3": "variant_3.html",

    # Mobile Counterparts
    "Mobile Landing Page": "mobile_landing.html",
    "Mobile Results View": "mobile_results.html",
    "Mobile Map Discovery": "mobile_map.html",
    "Mobile Analytics View & Dark Mode": "mobile_analytics.html"
}

def download_screens():
    with open("screens.json", "r") as f:
        data = json.load(f)

    screens = []
    # Check structuredContent first 
    if "result" in data and "structuredContent" in data["result"] and "screens" in data["result"]["structuredContent"]:
        screens = data["result"]["structuredContent"]["screens"]
    elif "result" in data and "screens" in data["result"]:
         screens = data["result"]["screens"]
    
    if not screens:
        print("No screens found in JSON")
        return

    for screen in screens:
        title = screen.get("title", "Unknown")
        name = screen.get("name", "")
        
        # Determine filename
        filename = filename_map.get(title)
        if not filename:
            # Fallback for unknown titles
            safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '_', '-')).strip().replace(' ', '_').lower()
            if not safe_title:
                 safe_title = name.split('/')[-1]
            filename = f"{safe_title}.html"
        
        # PROTECT BACKEND INTEGRATED FILES
        critical_files = ["login.html", "dashboard.html", "listings.html", "predictor.html", "analytics.html", "index.html", "user_dashboard.html"]
        if filename in critical_files:
            original_filename = filename
            filename = filename.replace(".html", "_stitch_raw.html")
            print(f"  [PROTECTED] Saving fresh design for '{original_filename}' as '{filename}' to preserve backend logic.")
        
        print(f"Processing '{title}' -> {filename}...")
        
        # Get content URL
        url = None
        if "htmlCode" in screen and "downloadUrl" in screen["htmlCode"]:
            url = screen["htmlCode"]["downloadUrl"]
        
        if url:
             try:
                 print(f"  Downloading from {url[:50]}...")
                 with urllib.request.urlopen(url) as response:
                     content = response.read()
                     with open(filename, "wb") as out_f:
                         out_f.write(content)
                 print("  Saved.")
             except Exception as e:
                 print(f"  Failed to download: {e}")
        else:
            print("  No HTML download URL found.")

if __name__ == "__main__":
    download_screens()
