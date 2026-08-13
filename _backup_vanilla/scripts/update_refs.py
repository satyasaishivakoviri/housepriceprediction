import os
import re

PAGES_DIR = "pages"
JS_FILES = [
    "real-estate-data.js", "firebase-config.js", "install-app.js", 
    "mobile-menu.js", "wishlist.js", "dashboard.js", "spa_router.js"
]

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Update link to index.html
    content = content.replace('href="index.html"', 'href="../index.html"')
    
    # Update local JS references (not starting with http, /, or ..)
    for js_file in JS_FILES:
        # Replace src="js_file" with src="../js/js_file"
        content = re.sub(f'src="{js_file}"', f'src="../js/{js_file}"', content)
        # Also handle if they were referenced as js/js_file (which would now be ../js/js_file)
        content = content.replace(f'src="js/{js_file}"', f'src="../js/{js_file}"')

    # Update logo/icon references
    content = content.replace('src="logo.png"', 'src="../assets/logo.png"')
    content = content.replace('src="icon.png"', 'src="../assets/icon.png"')
    
    # If they were referencing via assets/ folder
    content = content.replace('src="assets/', 'src="../assets/')
    
    # If they were referencing via css/ folder
    content = content.replace('href="css/', 'href="../css/')
    content = content.replace('src="css/', 'src="../css/') # unlikely for css but possible
    
    # Update CSS file direct reference if any
    # JS Redirects to index.html
    content = content.replace("window.location.href='index.html'", "window.location.href='../index.html'")
    content = content.replace('window.location.href="index.html"', 'window.location.href="../index.html"')
    content = content.replace("window.location.href = 'index.html'", "window.location.href = '../index.html'")
    content = content.replace('window.location.href = "index.html"', 'window.location.href = "../index.html"')
    
    if content != original_content:
        print(f"Updating {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

def main():
    if not os.path.exists(PAGES_DIR):
        print(f"Directory {PAGES_DIR} not found.")
        return

    for filename in os.listdir(PAGES_DIR):
        if filename.endswith(".html"):
            update_file(os.path.join(PAGES_DIR, filename))

if __name__ == "__main__":
    main()
