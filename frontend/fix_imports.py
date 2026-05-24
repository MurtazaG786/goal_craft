import os
import glob

# Search in frontend/src/app/**/*.tsx
search_pattern = r"c:\Users\Admin\Desktop\Github\goal_craft\frontend\src\app\**\*.tsx"
files = glob.glob(search_pattern, recursive=True)

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Calculate relative depth.
    # src/app is base. 
    # src/app/pages/X.tsx -> depth from app is 1. We need to go up 2 levels (../../api/goalApi)
    # src/app/components/X.tsx -> depth 1 -> ../../api/goalApi
    # src/app/context/X.tsx -> depth 1 -> ../../api/goalApi
    
    if '../api/goalApi' in content:
        content = content.replace('../api/goalApi', '../../api/goalApi')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")

print("Done")
