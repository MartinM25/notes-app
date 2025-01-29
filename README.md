# Simple Notes App

## Project Overview

The Simple Notes App is a desktop and web application that allows users to create, view,
edit, and delete notes. Built with Nextron (Next.js + Electron), the app provides a seamless
experience for managing notes with real-time updates. It also supports persistent data storage
using Electron’s fs module. Users can create and manage their notes in a user-friendly
interface with markdown support and search functionality.

### Features:

```
 Create and Edit Notes: Add new notes and edit them with rich-text formatting.
 Delete Notes: Remove unwanted notes.
 Markdown Support: Use basic markdown for formatting.
 Search Functionality: Quickly search through notes by title.
 Data Persistence: Notes are saved locally using the fs module and remain even after
closing the app.
```
## Setup and Installation Instructions

### Prerequisites:

Ensure you have the following installed:

```
 Node.js (latest stable version)
 npm (comes with Node.js)
```
### Clone the repository:

Clone the repository to your local machine:

bash
CopyEdit
git clone https://github.com/yourusername/simple-notes-app.git
cd simple-notes-app

### Installing Dependencies:

Install the required dependencies for both the frontend (React/Next.js) and Electron:

bash
CopyEdit
npm install

### Development Setup:

To run the app in development mode:


bash
CopyEdit
npm run dev

This will start both the Electron app and the Next.js development server. By default, the app
should open at [http://localhost:3000.](http://localhost:3000.)

### Building the Application:

To build the application for production:

bash
CopyEdit
npm run build
npm run start

This will create an executable for your platform (Windows, macOS, or Linux) and allow you
to run the app as a standalone desktop application.

## Project Structure Overview

### Frontend ( /frontend )

```
 /components/ : Contains all reusable components, such as Button, NoteCard,
SearchBar, etc.
 /pages/ : React pages for the main views like the homepage and editor.
 /styles/ : TailwindCSS configuration and styles.
 /utils/ : Helper functions for managing data and handling API calls.
```
### Electron ( /electron )

```
 main.js : The main process for Electron that initializes the app window, handles
system-level features (e.g., file saving/loading), and manages app lifecycle events.
 /app : Handles rendering the main UI of the app and bridges the frontend with the
backend.
```
### Data Persistence

```
 The app uses Electron’s fs module to read and write notes from a local file system,
ensuring that notes are saved and reloaded when the app restarts.
```
### State Management

```
 The app manages state with React hooks, with notes stored in the component’s state
and passed to the editor or note card components as needed.
```
## Contributing

We welcome contributions! Please follow these steps to submit an issue or pull request:


1. Fork the repository.
2. Create a feature branch (git checkout -b feature/your-feature).
3. Commit your changes (git commit -m 'Add new feature').
4. Push to the branch (git push origin feature/your-feature).
5. Open a pull request describing your changes.


