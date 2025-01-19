---
title: "Learning Python: Handling files"
description: "This article we will go through learning how to manipulate files in Python"
category: ["python"]
pubDate: "2025-01-16"
published: true
---

## Table of contents

# Introduction

File handling involves creating, reading, updating, and deleting files. Python's built-in `open()` function is the primary method for interacting with files. It takes two parameters: the filename and the mode in which the file should be opened.

# Modes for Opening Files

Python supports several modes for opening files:

- **Read Mode (`'r'`):** Opens a file for reading. If the file does not exist, it raises a `FileNotFoundError`.
- **Write Mode (`'w'`):** Opens a file for writing. If the file does not exist, it creates a new one. If it exists, the content is overwritten.
- **Append Mode (`'a'`):** Opens a file for appending. If the file does not exist, it creates a new one. If it exists, new content is added to the end.
- **Create Mode (`'x'`):** Creates a new file. If the file already exists, it raises a `FileExistsError`.
- **Text Mode (`'t'`):** Default mode for text files.
- **Binary Mode (`'b'`):** Used for binary files like images or videos.

You can combine modes, such as `'rb'` for reading binary files or `'wt'` for writing text files.

# Opening and Closing Files

To open a file, you use the `open()` function:

```python
# Open a file in read mode
file = open('example.txt', 'r')
```

It's crucial to close the file after use to free up system resources:

```python
# Close the file
file.close()
```

Alternatively, you can use the `with` statement, which automatically closes the file when you're done:

```python
# Using the with statement
with open('example.txt', 'r') as file:
    content = file.read()
```

# Reading Files

Python provides several methods for reading files:

- **`read()` Method:** Reads the entire file or a specified number of characters.

  ```python
  with open('example.txt', 'r') as file:
      content = file.read()  # Reads the entire file
      print(content)
  ```

- **`readline()` Method:** Reads a single line from the file.

  ```python
  with open('example.txt', 'r') as file:
      line = file.readline()
      print(line)
  ```

- **`readlines()` Method:** Reads all lines into a list.

  ```python
  with open('example.txt', 'r') as file:
      lines = file.readlines()
      for line in lines:
          print(line.strip())  # strip() removes newline characters
  ```

  # Writing Files

You can write to files using the `write()` or `writelines()` methods:

- **`write()` Method:** Writes a string to the file.

  ```python
  with open('example.txt', 'w') as file:
      file.write('Hello, world!')
  ```

- **`writelines()` Method:** Writes a list of strings to the file.

  ```python
  lines = ['Line 1\n', 'Line 2\n', 'Line 3\n']
  with open('example.txt', 'w') as file:
      file.writelines(lines)
  ```

  # Appending to Files

To append content to an existing file, use the append mode:

```python
with open('example.txt', 'a') as file:
    file.write('This is appended content.')
```

### Working with Binary Files

Binary files are handled similarly to text files but require the binary mode (`'b'`) when opening:

```python
# Copying a binary file
with open('source.jpg', 'rb') as source:
    with open('destination.jpg', 'wb') as destination:
        destination.write(source.read())
```

# File and Directory Manipulation

Python's `os` and `shutil` modules provide functions for file and directory operations:

- **Creating a Directory:**

  ```python
  import os
  os.mkdir('new_directory')
  ```

- **Renaming a File:**

  ```python
  import os
  os.rename('old_name.txt', 'new_name.txt')
  ```

- **Deleting a File:**

  ```python
  import os
  os.remove('file_to_delete.txt')
  ```

- **Copying a File:**

  ```python
  import shutil
  shutil.copy('source.txt', 'destination.txt')
  ```

# Handling Different File Formats

## CSV Files

The `csv` module is used for reading and writing CSV files:

```python
import csv

# Writing to a CSV file
with open('data.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['Name', 'Age'])
    writer.writerow(['John', 30])

# Reading from a CSV file
with open('data.csv', 'r') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        print(row)
```

## JSON Files

The `json` module is used for working with JSON files:

```python
import json

# Writing to a JSON file
data = {'name': 'John', 'age': 30}
with open('data.json', 'w') as jsonfile:
    json.dump(data, jsonfile)

# Reading from a JSON file
with open('data.json', 'r') as jsonfile:
    data = json.load(jsonfile)
    print(data)
```

## PDF Files

For handling PDF files, you can use libraries like `PyPDF2`:

```python
from PyPDF2 import PdfReader

# Reading a PDF file
with open('document.pdf', 'rb') as pdf_file:
    pdf_reader = PdfReader(pdf_file)
    for page in range(len(pdf_reader.pages)):
        print(pdf_reader.pages[page].extract_text())
```

# Handling big excel files

## Example 1: Analyzing Customer Purchase Data

Suppose you have a CSV file named `customer_purchases.csv` containing data about customer purchases, including customer IDs, product names, and purchase amounts. You want to analyze this data to find the total purchase amount for each product and identify the top-selling products.

**CSV File structure**

```
Customer ID,Product Name,Purchase Amount
1,iPhone,500
2,MacBook,1000
3,iPhone,600
4,iPad,400
5,MacBook,1200
```

**Python Code**

```python
import pandas as pd

# Read the CSV file into a DataFrame
df = pd.read_csv('customer_purchases.csv')

# Calculate the total purchase amount for each product
product_sales = df.groupby('Product Name')['Purchase Amount'].sum()

# Identify the top-selling products
top_selling_products = product_sales.nlargest(3)

print("Total Purchase Amount by Product:")
print(product_sales)
print("\nTop-Selling Products:")
print(top_selling_products)
```

## Example 2: Cleaning and Preprocessing Employee Data

Imagine you have a CSV file named `employee_data.csv` containing employee information, including names, departments, and job titles. However, the data contains some inconsistencies and missing values. You need to clean and preprocess this data for further analysis.

**CSV File structure**

```
Name,Department,Job Title
John Smith,HR,Manager
Alice Johnson,IT,Developer
Bob Williams,Finance,
Charlie Davis,HR,Manager
Eve Brown,,Developer
```

**Python Code**

```python
import pandas as pd

# Read the CSV file into a DataFrame
df = pd.read_csv('employee_data.csv')

# Identify missing values
missing_values = df.isnull().sum()
print("Missing Values:")
print(missing_values)

# Drop rows with missing job titles or departments
df = df.dropna(subset=['Job Title', 'Department'])

# Replace missing department with 'Unknown'
df['Department'] = df['Department'].fillna('Unknown')

print("\nCleaned DataFrame:")
print(df)
```

After reading the CSV file, we identify the missing values through `missing_values = df.isnull().sum()`, where `df.isnull()` returns a boolean mask indicating missing values (NaN) in the DataFrame. It returns `True` for missing values and `False` otherwise. Then we use the `.sum()` which counts the number of `True` values in the boolean mask, effectively counting the missing values in each column.

Next we drop the rows with missing job titles with `df = df.dropna(subset=['Job Title', 'Department'])` where `df.dropna` removes rows (or columns) with missing values and `subset=['Job Title', 'Department']` specifies that only rows with missing values in these two columns should be removed.

Next we select the `Department` column from DataFrame and replace the `NAN` with `Unknown`.

Let's see this with a more clear example where your CSV file look like this:

```
Name,Department,Job Title
John Smith,HR,Manager
Alice Johnson,IT,Developer
Bob Williams,Finance,
Charlie Davis,HR,Manager
Eve Brown,,Developer
```

1. **Reading the CSV:** The DataFrame `df` will contain the data from the CSV file.
2. **Identifying Missing Values:** The output will show that there are missing values in the `Job Title` and `Department` columns.
3. **Dropping Rows with Missing Values:** The row for Bob Williams will be removed because it has a missing `Job Title`, and the row for Eve Brown will be removed because it has a missing `Department`.
4. **Replacing Missing Department Values:** Since Eve Brown's row is already removed, no replacement will occur in this example. However, if there were other rows with missing departments, they would be replaced with `'Unknown'`.
5. **Printing the Cleaned DataFrame:** The final DataFrame will look like this:

   ```
   Name,Department,Job Title
   John Smith,HR,Manager
   Alice Johnson,IT,Developer
   Charlie Davis,HR,Manager
   ```

# Conclusion

File handling is a crucial skill for any developer in any language, allowing you to manage data effectively and perform various data processing tasks. By mastering the `open()` function in Python, understanding different file modes, and using appropriate libraries for specific file formats, you can efficiently handle files in Python. Whether you're working with text, binary, CSV, JSON, or PDF files, Python provides the tools you need to read, write, and manipulate files with ease.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
