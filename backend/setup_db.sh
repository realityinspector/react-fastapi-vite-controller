#!/bin/bash

# Initialize the database
python init_db.py

# Create the first admin user
python create_admin.py 