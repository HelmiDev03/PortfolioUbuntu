import React, { Component } from "react";
import ReactGA from "react-ga";

export class FileExplorer extends Component {
  constructor() {
    super();
    this.state = {
      currentPath: "/home/helmi/Documents",
      currentView: "documents", // only: documents, computer
      fileSystem: this.initializeFileSystem(),
      selectedItems: [],
      viewMode: "grid", // grid or list
      showContextMenu: false,
      contextMenuPos: { x: 0, y: 0 },
      contextMenuType: null, // 'background', 'item'
      showNewFolderDialog: false,
      showUploadDialog: false,
      showRenameDialog: false,
      showPdfViewer: false,
      currentPdfContent: null,
      currentPdfName: "",
      dialogValue: "",
      renameTarget: null,
      searchQuery: "",
      uploadFileContent: "",
      uploadFileName: "",
      isUploading: false,
    };
    this.fileInputRef = React.createRef();
  }

  initializeFileSystem() {
    const savedFileSystem = localStorage.getItem("fileExplorerData");
    if (savedFileSystem) {
      return JSON.parse(savedFileSystem);
    }

    return {
      "/": {
        type: "folder",
        name: "/",
        children: ["home"],
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      },
      "/home": {
        type: "folder",
        name: "home",
        children: ["helmi"],
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      },
      "/home/helmi": {
        type: "folder",
        name: "helmi",
        children: ["Documents"],
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      },
      "/home/helmi/Documents": {
        type: "folder",
        name: "Documents",
        children: ["README.txt", "Projects"],
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      },
      "/home/helmi/Documents/README.txt": {
        type: "file",
        name: "README.txt",
        content: "Welcome to Helmi's File Explorer!\n\nThis is a fully functional file manager built with React.\n\nFeatures:\n- Create folders and files\n- Navigate through directories\n- Rename and delete items\n- Search functionality\n- Grid and list view modes\n\nFeel free to explore and create your own files!",
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      },
      "/home/helmi/Documents/Projects": {
        type: "folder",
        name: "Projects",
        children: ["portfolio-notes.txt"],
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      },
      "/home/helmi/Documents/Projects/portfolio-notes.txt": {
        type: "file",
        name: "portfolio-notes.txt",
        content: "Portfolio Project Notes\n\nTechnologies used:\n- React.js\n- TailwindCSS\n- Ubuntu 20.04 Theme\n\nRunning since: 24/12/2021",
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      },
    };
  }

  componentDidMount() {
    document.addEventListener("click", this.hideContextMenu);
    // Load initial folder from MongoDB
    this.loadFolder(this.state.currentPath);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.hideContextMenu);
  }

  saveFileSystem = () => {
    localStorage.setItem("fileExplorerData", JSON.stringify(this.state.fileSystem));
  };

  getCurrentFolder = () => {
    return this.state.fileSystem[this.state.currentPath];
  };

  navigateTo = (path) => {
    // Always try to load via API; update state after load
    this.setState({ currentPath: path, selectedItems: [] }, () => {
      this.loadFolder(path);
      ReactGA.event({ category: "File Explorer", action: `Navigated to ${path}` });
    });
  };

  loadFolder = async (path) => {
    try {
      const res = await fetch(`/api/items/tree?path=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error(`Failed to load folder: ${res.status}`);
      const data = await res.json();

      // Build a minimal in-memory fileSystem snapshot for the current folder
      const fs = { ...this.state.fileSystem };
      const folderName = path.split('/').filter(Boolean).pop() || '/';
      fs[path] = { type: 'folder', name: folderName, children: data.items.map(i => i.name) };
      for (const it of data.items) {
        fs[it.path] = {
          type: it.type,
          name: it.name,
          adobeMetadata: it.adobeMetadata || null,
          cloudId: it.cloudId || null,
          fileId: it.fileId || null,
          modified: new Date().toISOString(),
        };
      }

      this.setState({ fileSystem: fs });
    } catch (err) {
      console.error(err);
      alert('Error loading folder');
    }
  };

  navigateUp = () => {
    const pathParts = this.state.currentPath.split("/").filter((p) => p);
    if (pathParts.length > 0) {
      pathParts.pop();
      const newPath = "/" + pathParts.join("/");
      this.navigateTo(newPath === "/" ? "/" : newPath);
    }
  };

  handleItemClick = async (itemName, isDoubleClick = false) => {
    const itemPath = this.getItemPath(itemName);
    const item = this.state.fileSystem[itemPath];

    if (isDoubleClick) {
      if (item.type === "folder") {
        this.navigateTo(itemPath);
      } else if (item.name.toLowerCase().endsWith(".pdf")) {
        try {
          // Show loading state when fetching from cloud
          if (item.fileId) {
            this.setState({ isUploading: true });
            const streamUrl = `/api/files/${item.fileId}/stream`;
            
            // Hide loading state
            this.setState({ isUploading: false });
            
            // Open PDF viewer with the latest content from Adobe Cloud
            this.setState({
              showPdfViewer: true,
              currentPdfContent: streamUrl,
              currentPdfName: item.name,
              currentPdfMetadata: item.adobeMetadata,
              selectedItems: [itemName]
            });
            
          } else {
            // For non-cloud PDFs, just show what we have
            this.setState({
              showPdfViewer: true,
              currentPdfContent: '',
              currentPdfName: item.name,
              currentPdfMetadata: item.adobeMetadata,
              selectedItems: [itemName]
            });
          }
        } catch (error) {
          console.error('Error retrieving PDF from cloud:', error);
          alert('Error retrieving PDF from cloud: ' + error.message);
          this.setState({ isUploading: false });
          
          // Fallback to local content
          this.setState({
            showPdfViewer: true,
            currentPdfContent: '',
            currentPdfName: item.name,
            currentPdfMetadata: item.adobeMetadata,
            selectedItems: [itemName]
          });
        }
      }
    } else {
      this.setState({ selectedItems: [itemName] });
    }
  };

  handleContextMenu = (e, itemName = null) => {
    e.preventDefault();
    e.stopPropagation();
    
    this.setState({
      showContextMenu: true,
      contextMenuPos: { x: e.clientX, y: e.clientY },
      contextMenuType: itemName ? "item" : "background",
      selectedItems: itemName ? [itemName] : [],
    });
  };

  hideContextMenu = () => {
    this.setState({ showContextMenu: false });
  };

  getItemPath = (itemName) => {
    return this.state.currentPath === "/" 
      ? `/${itemName}` 
      : `${this.state.currentPath}/${itemName}`;
  };

  createNewFolder = async () => {
    const folderName = this.state.dialogValue.trim();
    if (!folderName) return;
    try {
      const res = await fetch('/api/items/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: folderName, type: 'folder', parentPath: this.state.currentPath })
      });
      if (!res.ok) throw new Error('Failed to create folder');
      this.setState({ showNewFolderDialog: false, dialogValue: '' });
      await this.loadFolder(this.state.currentPath);
      ReactGA.event({ category: 'File Explorer', action: 'Created new folder (DB)' });
    } catch (e) {
      console.error(e);
      alert('Error creating folder');
    }
  };

  createNewFile = async () => {
    const fileName = this.state.dialogValue.trim();
    if (!fileName) return;
    try {
      const res = await fetch('/api/items/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fileName, type: 'file', parentPath: this.state.currentPath })
      });
      if (!res.ok) throw new Error('Failed to create file');
      this.setState({ showNewFileDialog: false, dialogValue: '' });
      await this.loadFolder(this.state.currentPath);
      ReactGA.event({ category: 'File Explorer', action: 'Created new file (DB)' });
    } catch (e) {
      console.error(e);
      alert('Error creating file');
    }
  };

  handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }

    // Show loading state
    this.setState({ isUploading: true });

    // Process with Adobe PDF Services API
    this.processPdfWithAdobe(file);
  };
  
  processPdfWithAdobe = async (file) => {
    console.log('Uploading PDF to GridFS and processing with Adobe PDF Services');
    try {
      // 1) Read file as data URL
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 2) Upload raw PDF to GridFS
      const uploadRes = await fetch('/api/files/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, dataUrl })
      });
      if (!uploadRes.ok) throw new Error('Failed to store PDF in DB');
      const { fileId } = await uploadRes.json();

      // 3) Call Adobe route for real processing (will require env credentials)
      // We do not rely on simulated metadata/content.
      let adobeMetadata = null;
      try {
        const resp = await fetch('/api/adobe-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'analyze', fileName: file.name, pdfData: dataUrl })
        });
        if (resp.ok) {
          const meta = await resp.json();
          if (meta && meta.success) adobeMetadata = meta.metadata || null;
        }
      } catch (e) {
        console.warn('Adobe processing skipped or failed:', e.message);
      }

      // 4) Persist item with fileId + adobeMetadata
      await this.uploadFile(file.name, null, adobeMetadata, null, fileId);

      // 5) Hide loading and refresh UI
      this.setState({ isUploading: false });
      await this.loadFolder(this.state.currentPath);
      alert('PDF uploaded successfully');
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF: ' + error.message);
      this.setState({ isUploading: false });
    }
  };

  uploadFile = async (fileName, content, adobeMetadata = null, cloudId = null, fileId = null) => {
    try {
      const res = await fetch('/api/items/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fileName, type: 'file', parentPath: this.state.currentPath, cloudId, adobeMetadata, fileId })
      });
      if (!res.ok) throw new Error('Failed to save PDF in DB');
      await this.loadFolder(this.state.currentPath);
      ReactGA.event({ category: 'File Explorer', action: 'Uploaded PDF (DB)' });
    } catch (e) {
      console.error(e);
      alert('Error saving PDF');
    }
  };

  navigateToView = (view) => {
    const viewPaths = {
      documents: "/home/helmi/Documents",
    };

    if (viewPaths[view]) {
      this.setState({ currentView: view, currentPath: viewPaths[view], selectedItems: [] });
    } else if (view === "computer") {
      this.setState({ currentView: "computer" });
    }
  };

  deleteItem = async (itemName) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}"?`)) return;
    const itemPath = this.getItemPath(itemName);
    try {
      const res = await fetch('/api/items/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: itemPath })
      });
      if (!res.ok) throw new Error('Failed to delete');
      await this.loadFolder(this.state.currentPath);
      this.setState({ selectedItems: [] });
      ReactGA.event({ category: 'File Explorer', action: 'Deleted item (DB)' });
    } catch (e) {
      console.error(e);
      alert('Error deleting item');
    }
  };

  renameItem = async () => {
    const newName = this.state.dialogValue.trim();
    if (!newName || !this.state.renameTarget) return;
    const oldPath = this.getItemPath(this.state.renameTarget);
    try {
      const res = await fetch('/api/items/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath, newName })
      });
      if (!res.ok) throw new Error('Failed to rename');
      this.setState({ showRenameDialog: false, dialogValue: '', renameTarget: null });
      await this.loadFolder(this.state.currentPath);
      ReactGA.event({ category: 'File Explorer', action: 'Renamed item (DB)' });
    } catch (e) {
      console.error(e);
      alert('Error renaming item');
    }
  };

  getBreadcrumbs = () => {
    // Always treat Documents as the root
    const rootPath = "/home/helmi/Documents";
    const pathParts = this.state.currentPath
      .replace(/^\/+/, "")
      .split("/")
      .filter((p) => p);

    const idxDocs = pathParts.findIndex((p) => p.toLowerCase() === "documents");
    const partsFromDocs = idxDocs >= 0 ? pathParts.slice(idxDocs) : ["Documents"]; 

    const breadcrumbs = [{ name: "Documents", path: rootPath }];
    let currentPath = rootPath;
    for (let i = 1; i < partsFromDocs.length; i++) {
      currentPath += "/" + partsFromDocs[i];
      breadcrumbs.push({ name: partsFromDocs[i], path: currentPath });
    }
    return breadcrumbs;
  };

  getFileIcon = (item) => {
    if (item.type === "folder") {
      return "./themes/Yaru/system/folder.png";
    }
    
    const extension = item.name.split(".").pop().toLowerCase();
    const iconMap = {
      txt: "./themes/Yaru/apps/text-editor.png",
      js: "./themes/Yaru/apps/vscode.png",
      json: "./themes/Yaru/apps/vscode.png",
      html: "./themes/Yaru/apps/chrome.png",
      css: "./themes/Yaru/apps/vscode.png",
      md: "./themes/Yaru/apps/text-editor.png",
      png: "./themes/Yaru/system/image.png",
      jpg: "./themes/Yaru/system/image.png",
      jpeg: "./themes/Yaru/system/image.png",
      gif: "./themes/Yaru/system/image.png",
      mp4: "./themes/Yaru/system/video.png",
      mp3: "./themes/Yaru/apps/spotify.png",
    };

    return iconMap[extension] || "./themes/Yaru/apps/text-editor.png";
  };

  filterItems = () => {
    const currentFolder = this.getCurrentFolder();
    if (!currentFolder || !currentFolder.children) return [];

    const items = currentFolder.children
      .map((childName) => {
        const itemPath = this.getItemPath(childName);
        return this.state.fileSystem[itemPath];
      })
      .filter((item) => item);

    if (this.state.searchQuery) {
      return items.filter((item) =>
        item.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())
      );
    }

    return items;
  };

  renderSidebar() {
    const sidebarItems = [
      { id: "documents", label: "Documents", icon: "📄", path: "/home/helmi/Documents" },
    ];

    return (
      <div className="w-48 bg-gray-800 border-r border-gray-700 flex flex-col text-sm">
        <div className="p-2">
          <div className="text-gray-400 text-xs px-2 py-1 font-semibold">Places</div>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.path && this.navigateToView(item.id)}
              disabled={!item.path}
              className={`w-full text-left px-2 py-1.5 rounded flex items-center space-x-2 ${
                this.state.currentView === item.id 
                  ? "bg-ubb-orange bg-opacity-70" 
                  : item.path 
                  ? "hover:bg-gray-700" 
                  : "text-gray-500 cursor-default"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-2 border-t border-gray-700">
          <div className="text-gray-400 text-xs px-2 py-1 font-semibold">Devices</div>
          <button
            onClick={() => this.navigateToView("computer")}
            className={`w-full text-left px-2 py-1.5 rounded flex items-center space-x-2 ${
              this.state.currentView === "computer" ? "bg-ubb-orange bg-opacity-70" : "hover:bg-gray-700"
            }`}
          >
            <span className="text-base">💻</span>
            <span className="text-xs">Computer</span>
          </button>
        </div>
      </div>
    );
  }

  renderComputerView() {
    const specs = [
      { label: "Processor", value: "Intel Core i7-11800H @ 2.30GHz" },
      { label: "Cores", value: "8 cores, 16 threads" },
      { label: "RAM", value: "16 GB DDR4-3200" },
      { label: "Graphics", value: "NVIDIA GeForce RTX 3060 Mobile" },
      { label: "Storage", value: "512 GB NVMe SSD" },
      { label: "Operating System", value: "Ubuntu 20.04.3 LTS (Focal Fossa)" },
      { label: "Kernel", value: "Linux 5.11.0-40-generic x86_64" },
      { label: "Desktop Environment", value: "GNOME 3.36.8" },
    ];

    return (
      <div className="p-6 flex-1 overflow-y-auto bg-ub-grey">
        <div className="flex items-center space-x-4 mb-6">
          <div className="text-6xl">💻</div>
          <div>
            <h2 className="text-2xl font-bold">Computer</h2>
            <p className="text-gray-400">System Information</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 space-y-3">
          {specs.map((spec, index) => (
            <div key={index} className="flex justify-between border-b border-gray-700 pb-3 last:border-b-0">
              <span className="text-gray-400 font-medium">{spec.label}:</span>
              <span className="font-semibold text-white">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const currentFolder = this.getCurrentFolder();
    const items = this.state.currentView === "computer" ? [] : this.filterItems();
    const breadcrumbs = this.getBreadcrumbs();

    return (
      <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none">
        {/* Toolbar */}
        <div className="flex items-center justify-between w-full bg-ub-grey border-b border-gray-700 px-2 py-1">
          <div className="flex items-center space-x-2">
            <button
              onClick={this.navigateUp}
              disabled={this.state.currentPath === "/home/helmi/Documents" || this.state.currentView === "computer"}
              className="p-1.5 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Back"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
            </button>
            
            <button
              onClick={() => this.navigateTo("/home/helmi/Documents")}
              className="p-1.5 hover:bg-gray-700 rounded"
              title="Documents"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
            </button>

            <input
              type="file"
              ref={this.fileInputRef}
              onChange={this.handleFileUpload}
              accept="application/pdf"
              className="hidden"
            />
            
            <button
              onClick={() => this.fileInputRef.current.click()}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
              title="Upload PDF"
            >
              Upload PDF
            </button>
          </div>

          <div className="flex items-center space-x-2 flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Search..."
              value={this.state.searchQuery}
              onChange={(e) => this.setState({ searchQuery: e.target.value })}
              className="flex-1 px-3 py-1 bg-ub-cool-grey border border-gray-600 rounded text-sm outline-none focus:border-ubb-orange"
            />
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => this.setState({ viewMode: "grid" })}
              className={`p-1.5 hover:bg-gray-700 rounded ${this.state.viewMode === "grid" ? "bg-gray-700" : ""}`}
              title="Grid view"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
            <button
              onClick={() => this.setState({ viewMode: "list" })}
              className={`p-1.5 hover:bg-gray-700 rounded ${this.state.viewMode === "list" ? "bg-gray-700" : ""}`}
              title="List view"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {this.renderSidebar()}

          {/* Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Breadcrumb Navigation */}
            {this.state.currentView !== "computer" && (
              <div className="flex items-center px-3 py-2 bg-ub-grey border-b border-gray-700 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    {index > 0 && <span className="mx-2 text-gray-500">/</span>}
                    <button
                      onClick={() => this.navigateTo(crumb.path)}
                      className="hover:text-ubb-orange"
                    >
                      {crumb.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* File/Folder Display Area */}
            {this.state.currentView === "computer" ? (
              this.renderComputerView()
            ) : (
              <div
                className="flex-1 overflow-y-auto p-4 bg-ub-grey windowMainScreen"
                onContextMenu={(e) => this.handleContextMenu(e)}
                onClick={() => this.setState({ selectedItems: [] })}
              >
                <div className="flex justify-between mb-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => this.setState({ showNewFolderDialog: true, dialogValue: "" })}
                      className="px-3 py-1 bg-ubb-orange hover:bg-orange-600 rounded text-sm"
                      title="New folder"
                    >
                      + Folder
                    </button>
                    <button
                      onClick={() => this.setState({ showNewFileDialog: true, dialogValue: "" })}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                      title="New file"
                    >
                      + File
                    </button>
                  </div>
                </div>

                {items.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    {this.state.searchQuery ? "No items found" : "This folder is empty"}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {items.map((item) => (
                      <div
                        key={item.name}
                        className={`flex flex-col items-center p-2 rounded cursor-pointer hover:bg-white hover:bg-opacity-5 ${
                          this.state.selectedItems.includes(item.name) ? "bg-ubb-orange bg-opacity-30" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          this.handleItemClick(item.name);
                        }}
                        onDoubleClick={() => this.handleItemClick(item.name, true)}
                        onContextMenu={(e) => this.handleContextMenu(e, item.name)}
                      >
                        <img src={this.getFileIcon(item)} alt={item.name} className="w-16 h-16 mb-2" />
                        <span className="text-xs text-center break-all">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Context Menu */}
        {this.state.showContextMenu && (
          <div
            className="fixed bg-ub-cool-grey border border-gray-700 rounded shadow-lg py-1 z-50"
            style={{
              left: this.state.contextMenuPos.x,
              top: this.state.contextMenuPos.y,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {this.state.contextMenuType === "background" ? (
              <>
                <button
                  onClick={() => {
                    this.setState({ showNewFolderDialog: true, dialogValue: "", showContextMenu: false });
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm"
                >
                  New Folder
                </button>
                <button
                  onClick={() => {
                    this.setState({ showNewFileDialog: true, dialogValue: "", showContextMenu: false });
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm"
                >
                  New File
                </button>
                <button
                  onClick={() => {
                    this.fileInputRef.current.click();
                    this.setState({ showContextMenu: false });
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm"
                >
                  Upload PDF
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    const itemName = this.state.selectedItems[0];
                    this.setState({
                      showRenameDialog: true,
                      dialogValue: itemName,
                      renameTarget: itemName,
                      showContextMenu: false,
                    });
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm"
                >
                  Rename
                </button>
                <button
                  onClick={() => {
                    this.deleteItem(this.state.selectedItems[0]);
                    this.setState({ showContextMenu: false });
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}

        {/* New Folder Dialog */}
        {this.state.showNewFolderDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-ub-cool-grey border border-gray-700 rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
              <input
                type="text"
                placeholder="Folder name"
                value={this.state.dialogValue}
                onChange={(e) => this.setState({ dialogValue: e.target.value })}
                onKeyPress={(e) => e.key === "Enter" && this.createNewFolder()}
                className="w-full px-3 py-2 bg-ub-grey border border-gray-600 rounded outline-none focus:border-ubb-orange"
                autoFocus
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => this.setState({ showNewFolderDialog: false, dialogValue: "" })}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={this.createNewFolder}
                  className="px-4 py-2 bg-ubb-orange hover:bg-orange-600 rounded"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New File Dialog */}
        {this.state.showNewFileDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-ub-cool-grey border border-gray-700 rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Create New File</h3>
              <input
                type="text"
                placeholder="File name (e.g., document.txt)"
                value={this.state.dialogValue}
                onChange={(e) => this.setState({ dialogValue: e.target.value })}
                onKeyPress={(e) => e.key === "Enter" && this.createNewFile()}
                className="w-full px-3 py-2 bg-ub-grey border border-gray-600 rounded outline-none focus:border-ubb-orange"
                autoFocus
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => this.setState({ showNewFileDialog: false, dialogValue: "" })}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={this.createNewFile}
                  className="px-4 py-2 bg-ubb-orange hover:bg-orange-600 rounded"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rename Dialog */}
        {this.state.showRenameDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-ub-cool-grey border border-gray-700 rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Rename Item</h3>
              <input
                type="text"
                placeholder="New name"
                value={this.state.dialogValue}
                onChange={(e) => this.setState({ dialogValue: e.target.value })}
                onKeyPress={(e) => e.key === "Enter" && this.renameItem()}
                className="w-full px-3 py-2 bg-ub-grey border border-gray-600 rounded outline-none focus:border-ubb-orange"
                autoFocus
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => this.setState({ showRenameDialog: false, dialogValue: "", renameTarget: null })}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={this.renameItem}
                  className="px-4 py-2 bg-ubb-orange hover:bg-orange-600 rounded"
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* PDF Viewer */}
        {this.state.showPdfViewer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-ub-cool-grey border border-gray-700 rounded-lg p-4 w-4/5 h-4/5 flex flex-col">
              <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
                <h3 className="text-lg font-semibold">{this.state.currentPdfName}</h3>
                <button
                  onClick={() => this.setState({ showPdfViewer: false, currentPdfContent: null, currentPdfName: "" })}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 bg-white rounded overflow-hidden">
                <div className="w-full h-full flex flex-col">
                  <div className="bg-gray-800 p-2 text-sm">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Processed with Adobe PDF Services API</span>
                    {this.state.currentPdfMetadata && (
                      <span className="ml-2 text-gray-400">Document ID: {this.state.currentPdfMetadata.documentId}</span>
                    )}
                  </div>
                  <iframe 
                    src={this.state.currentPdfContent} 
                    className="w-full h-full" 
                    title="PDF Viewer"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading Indicator */}
        {this.state.isUploading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-ub-cool-grey border border-gray-700 rounded-lg p-6 flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ubb-orange mb-4"></div>
              <p className="text-lg">Uploading PDF...</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default FileExplorer;

export const displayFileExplorer = () => {
  return <FileExplorer />;
};
