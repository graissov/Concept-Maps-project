Certainly! Here's the revised README for your "Concept Map Creation Tool" project incorporating the database setup details and removing the testing section:

---

# Concept Map Creation Tool

## Description

The Concept Map Creation Tool is designed to help users create customizable concept maps on any topic, facilitating easier understanding and presentation of information. This tool aims to enhance the learning experience for students by visually organizing concepts and their interconnections.

## Live Demo

[Click here to view a live demo of the application](#) (if available).

## Technologies Used

- **Front-end:** React
- **Back-end:** Flask
- **Database:** MySQL

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need the following tools installed on your system:

- Node.js and npm (Node Package Manager)
- Python 3 and pip (Python's package installer)
- MySQL Server

```bash
# Install Node.js and npm
npm install npm@latest -g

# Install Python and pip
python -m pip install --upgrade pip
```

### Installing

Follow these step-by-step instructions to set up your development environment:

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/Concept-Maps-project.git
   cd Concept-Maps-project
   ```

2. **Install Python Dependencies**

   Before running the application, you'll need to install the necessary Python libraries:

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up the Backend (Flask)**

   Start the backend server:

   ```bash
   python ConceptMapsProjectBackend.py
   ```

4. **Set up the Database**

   Ensure your MySQL server is running. Use the provided SQL script to create the necessary tables for the Concept Map Creation Tool:

   1. **Log in to your MySQL server**:
      You can use a MySQL client or command line interface.

      ```bash
      mysql -u root -p
      ```

   2. **Create the database** (if not already created):
      
      ```sql
      CREATE DATABASE concept_maps;
      USE concept_maps;
      ```

   3. **Create the `objects` table**:

      ```sql
      CREATE TABLE objects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          parent_id INT,
          title VARCHAR(255) NOT NULL,
          area VARCHAR(255) NOT NULL,
          related_concepts TEXT
      );
      ```

5. **Set up the Frontend (React)**

   Navigate to the frontend directory and install the required npm packages.

   ```bash
   cd frontend
   npm install
   npm start
   ```

   This should open the application on `localhost:3000`.

### Usage

Detailed instructions and video demonstrations on how to use the Concept Map Creation Tool can be found here:

[User Guide and Video Demonstrations](#)

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Inspiration from educational tools
- Anyone who contributed code and ideas
- Community feedback

---

This updated README is now more concise and reflects the actual structure and setup steps for your project.
