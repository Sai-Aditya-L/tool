import csv
from typing import List, Dict
import sys
from pathlib import Path
from datetime import datetime

def read_csv_file(file_path: str) -> List[Dict]:
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
    for record in records:
        if record.get(field) == value:
            return record
    return None

def compare_records(record1: Dict, record2: Dict) -> Dict:
    differences = {}
    for key in record1.keys():
        if key in record2 and record1[key] != record2[key]:
            differences[key] = {
                'file1': record1[key],
                'file2': record2[key]
            }
    return differences

def write_differences_to_csv(differences: List[Dict], output_file: str):
    if not differences:
        return
    
    # Create headers for the output file
    headers = ['Record_ID', 'Field', 'File1_Value', 'File2_Value', 'Status']
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        
        for diff in differences:
            if 'differences' in diff:
                for field, values in diff['differences'].items():
                    writer.writerow({
                        'Record_ID': diff['identifier'],
                        'Field': field,
                        'File1_Value': values['file1'],
                        'File2_Value': values['file2'],
                        'Status': 'Modified'
                    })
            else:
                writer.writerow({
                    'Record_ID': diff['identifier'],
                    'Field': 'N/A',
                    'File1_Value': 'Present',
                    'File2_Value': 'Missing',
                    'Status': diff['status']
                })

def main():
    file1_path = input("Enter path to first CSV file: ")
    file2_path = input("Enter path to second CSV file: ")
    
    print("\nReading files...")
    data1 = read_csv_file(file1_path)
    data2 = read_csv_file(file2_path)
    
    # Generate output filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"differences_{timestamp}.csv"

    while True:
        print("\nOptions:")
        print("1. Show all differences")
        print("2. Search by specific field")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ")

        if choice == '1':
            print("\nComparing files...")
            all_differences = []
            
            for record1 in data1:
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

            if all_differences:
                write_differences_to_csv(all_differences, output_file)
                print(f"\nDifferences written to: {output_file}")
                
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
            print("\nAvailable fields:", ', '.join(data1[0].keys()))
            search_field = input("Enter field name to search: ")
            search_value = input("Enter value to search: ")

            record1 = find_record_by_field(data1, search_field, search_value)
            record2 = find_record_by_field(data2, search_field, search_value)

            if record1 or record2:
                differences = []
                if record1 and record2:
                    diff = compare_records(record1, record2)
                    if diff:
                        differences.append({
                            'identifier': record1[list(record1.keys())[0]],
                            'differences': diff
                        })
                        write_differences_to_csv(differences, f"search_results_{timestamp}.csv")
                        print(f"\nDifferences written to: search_results_{timestamp}.csv")
                        
                        print("\nDifferences found:")
                        for field, values in diff.items():
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
