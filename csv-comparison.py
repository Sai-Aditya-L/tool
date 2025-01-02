import csv
from typing import List, Dict
import sys
from pathlib import Path

def read_csv_file(file_path: str) -> List[Dict]:
    """
    Read a CSV file and return its contents as a list of dictionaries.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return list(csv.DictReader(file))
    except FileNotFoundError:
        print(f"Error: File {file_path} not found.")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file {file_path}: {str(e)}")
        sys.exit(1)

def find_record_by_field(records: List[Dict], field: str, value: str) -> Dict:
    """
    Find a record in the list of dictionaries based on a field value.
    """
    for record in records:
        if record.get(field) == value:
            return record
    return None

def compare_records(record1: Dict, record2: Dict) -> Dict:
    """
    Compare two records and return the differences.
    """
    differences = {}
    for key in record1.keys():
        if key in record2 and record1[key] != record2[key]:
            differences[key] = {
                'file1': record1[key],
                'file2': record2[key]
            }
    return differences

def main():
    # Get file paths from user
    file1_path = input("Enter path to first CSV file: ")
    file2_path = input("Enter path to second CSV file: ")

    # Read CSV files
    print("\nReading files...")
    data1 = read_csv_file(file1_path)
    data2 = read_csv_file(file2_path)

    while True:
        print("\nOptions:")
        print("1. Show all differences")
        print("2. Search by specific field")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ")

        if choice == '1':
            # Compare all records
            print("\nComparing files...")
            all_differences = []
            
            for record1 in data1:
                # Use the first column as the identifier (modify as needed)
                identifier_field = list(record1.keys())[0]
                record2 = find_record_by_field(data2, identifier_field, record1[identifier_field])
                
                if record2:
                    differences = compare_records(record1, record2)
                    if differences:
                        all_differences.append({
                            'identifier': record1[identifier_field],
                            'differences': differences
                        })
                else:
                    all_differences.append({
                        'identifier': record1[identifier_field],
                        'status': 'Record only in first file'
                    })

            # Display results
            if all_differences:
                print("\nDifferences found:")
                for diff in all_differences:
                    print(f"\nRecord ID: {diff['identifier']}")
                    if 'differences' in diff:
                        for field, values in diff['differences'].items():
                            print(f"  {field}:")
                            print(f"    File 1: {values['file1']}")
                            print(f"    File 2: {values['file2']}")
                    else:
                        print(f"  {diff['status']}")
            else:
                print("\nNo differences found.")

        elif choice == '2':
            # Search by specific field
            print("\nAvailable fields:", ', '.join(data1[0].keys()))
            search_field = input("Enter field name to search: ")
            search_value = input("Enter value to search: ")

            record1 = find_record_by_field(data1, search_field, search_value)
            record2 = find_record_by_field(data2, search_field, search_value)

            if record1 or record2:
                if record1 and record2:
                    differences = compare_records(record1, record2)
                    if differences:
                        print("\nDifferences found:")
                        for field, values in differences.items():
                            print(f"\n{field}:")
                            print(f"  File 1: {values['file1']}")
                            print(f"  File 2: {values['file2']}")
                    else:
                        print("\nNo differences found for this record.")
                elif record1:
                    print("\nRecord only exists in first file:")
                    print(record1)
                else:
                    print("\nRecord only exists in second file:")
                    print(record2)
            else:
                print("\nNo matching records found.")

        elif choice == '3':
            print("\nExiting program...")
            break

        else:
            print("\nInvalid choice. Please try again.")

if __name__ == "__main__":
    main()
