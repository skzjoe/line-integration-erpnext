
import frappe
from line_integration.line_integration.api.line_webhook import normalize_key, fetch_menu_items

def check_items():
    print("--- Fetching Menu Items ---")
    items = fetch_menu_items(limit=1000)
    print(f"Found {len(items)} items.")
    
    item_map = {normalize_key(item.item_name or item.name): item for item in items}
    
    # Debug: print first 10 keys
    print("Sample keys in map:", list(item_map.keys())[:10])

    # The user's specific inputs from the screenshot/message
    # Assuming the "1", "2" are part of the name or user added them?
    # Let's test both hypotheses.
    test_inputs = [
        "1 Bye Heavy",
        "2 Green Hug",
        "3 Glow Skin",
        "4 Calm & Kale"
    ]

    print("\n--- Testing Matches ---")
    for raw_name in test_inputs:
        key = normalize_key(raw_name)
        print(f"Searching for '{raw_name}' (key='{key}')...")
        
        # Direct match
        match = item_map.get(key)
        if match:
             print(f"  [DIRECT MATCH] -> Item: {match.item_name} ({match.name})")
             continue
             
        # Fuzzy match
        found = False
        for k, candidate in item_map.items():
            if key in k or k in key:
                print(f"  [FUZZY MATCH] '{key}' <-> '{k}' -> Item: {candidate.item_name} ({candidate.name})")
                found = True
                break
        
        if not found:
            print(f"  [NO MATCH FOUND]")

if __name__ == "__main__":
    frappe.connect()
    check_items()
