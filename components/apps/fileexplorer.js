import React, { Component } from "react";
import ReactGA from "react-ga";
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';

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
      // Generic viewer state
      showViewer: false,
      viewerTitle: "",
      viewerUrl: "",
      viewerMime: "",
      viewerText: "",
      dialogValue: "",
      renameTarget: null,
      searchQuery: "",
      uploadFileContent: "",
      uploadFileName: "",
      isUploading: false,
      uploadingLabel: '',
      copyMsg: '',
      showDeleteDialog: false,
      deleteTargetName: null,
      isLoadingFolder: false,
      // Auth/UI state
      userName: `guest-${Math.floor(1000 + Math.random()*9000)}`,
      isEditor: false,
      showLoginDialog: false,
      loginInput: '',
      loginError: '',
    };
    this.fileInputRef = React.createRef();
  }

  initializeFileSystem() {
    // Start empty and always load from API (DB + Supabase)
    return {};
  }

  componentDidMount() {
    document.addEventListener("click", this.hideContextMenu);
    // Load initial folder from MongoDB
    this.loadFolder(this.state.currentPath);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.hideContextMenu);
  }

  // Removed localStorage persistence; data is sourced from API only

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
      this.setState({ isLoadingFolder: true });
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
          storagePath: it.storagePath || null,
          mimeType: it.mimeType || null,
          sizeBytes: it.sizeBytes || null,
          publicUrl: it.publicUrl || null,
          modified: new Date().toISOString(),
        };
      }

      this.setState({ fileSystem: fs });
    } catch (err) {
      console.error(err);
      alert('Error loading folder');
    } finally {
      this.setState({ isLoadingFolder: false });
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
      } else if (item.type === 'file') {
        if (!item.publicUrl) return alert('No public URL available for this file');
        this.openViewer(item);
      }
    } else {
      this.setState({ selectedItems: [itemName] });
    }
  };

  openViewer = async (item) => {
    const { publicUrl, mimeType, name } = item;
    const lower = (mimeType || '').toLowerCase();

    // Defaults
    let viewerText = '';

    // For text-like content, fetch text for inline viewing
    const isTextLike = lower.startsWith('text/') ||
      lower === 'application/json' ||
      /\.(js|jsx|ts|tsx|py|java|c|cpp|css|html|md|txt)$/i.test(name || '');
    if (isTextLike) {
      try {
        const resp = await fetch(publicUrl);
        viewerText = await resp.text();
      } catch (e) {
        console.warn('Failed to fetch text for viewer', e);
      }
    }

    this.setState({
      showViewer: true,
      viewerTitle: name,
      viewerUrl: publicUrl,
      viewerMime: lower,
      viewerText,
    });
  };

  getCodeExtensions = (name, mime) => {
    const lower = (name || '').toLowerCase();
    if (lower.match(/\.(js|jsx|ts|tsx)$/) || mime === 'application/json') {
      // typescript: true will enable TS mode when ts/tsx
      const isTS = /\.(ts|tsx)$/.test(lower);
      return [javascript({ jsx: /\.(jsx|tsx)$/.test(lower), typescript: isTS })];
    }
    if (lower.endsWith('.py')) return [python()];
    // Fallback to no specific language
    return [];
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

  handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    this.setState({ isUploading: true, uploadingLabel: `Uploading ${file.name}...` });
    try {
      // Read file as data URL
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Optional: map currentPath to a prefix for storage organization
      const pathPrefix = 'uploads';

      const uploadRes = await fetch('/api/files/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, dataUrl, pathPrefix })
      });
      if (!uploadRes.ok) throw new Error('Failed to upload to storage');
      const { storagePath, mimeType, sizeBytes, publicUrl } = await uploadRes.json();

      // Persist item with Supabase fields
      await this.uploadFile(file.name, { storagePath, mimeType, sizeBytes, publicUrl });

      this.setState({ isUploading: false, uploadingLabel: '' });
      await this.loadFolder(this.state.currentPath);
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
      this.setState({ isUploading: false, uploadingLabel: '' });
    }
  };

  uploadFile = async (fileName, storageMeta) => {
    try {
      const res = await fetch('/api/items/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fileName,
          type: 'file',
          parentPath: this.state.currentPath,
          storagePath: storageMeta?.storagePath || null,
          mimeType: storageMeta?.mimeType || null,
          sizeBytes: storageMeta?.sizeBytes || null,
          publicUrl: storageMeta?.publicUrl || null,
        })
      });
      if (!res.ok) throw new Error('Failed to save file in DB');
      await this.loadFolder(this.state.currentPath);
      ReactGA.event({ category: 'File Explorer', action: 'Uploaded file (DB)' });
    } catch (e) {
      console.error(e);
      alert('Error saving file');
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
    const CDN = 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme/icons/';
    if (item.type === 'folder') {
      return "./themes/Yaru/system/folder.png";
    }

    const extension = (item.name.split('.').pop() || '').toLowerCase();
    const map = {
      // documents
      pdf: 'pdf',
      doc: 'word',
      docx: 'word',
      ppt: 'powerpoint',
      pptx: 'powerpoint',
      xls: 'excel',
      xlsx: 'excel',
      csv: 'csv',
      txt: 'text',
      md: 'markdown',
      rtf: 'text',
      xml: 'xml',
      json: 'json',
      yaml: 'yaml',
      yml: 'yaml',
      lock: 'lock',
      gitignore: 'git',
      // code
      js: 'javascript',
      jsx: 'react',
      ts: 'typescript',
      tsx: 'react_ts',
      py: 'python',
      java: 'java',
      c: 'c',
      h: 'c',
      cpp: 'cpp',
      hpp: 'cpp',
      cs: 'csharp',
      php: 'php',
      go: 'go',
      rs: 'rust',
      sh: 'bash',
      css: 'css',
      scss: 'sass',
      html: 'html',
      // media
      png: 'image',
      jpg: 'image',
      jpeg: 'image',
      gif: 'image',
      webp: 'image',
      bmp: 'image',
      svg: 'svg',
      mp4: 'video',
      webm: 'video',
      ogg: 'video',
      mp3: 'audio',
      wav: 'audio',
      m4a: 'audio',
      // archives
      zip: 'zip',
      rar: 'zip',
      '7z': 'zip',
      tar: 'zip',
      gz: 'zip',
      bz2: 'zip',
      xz: 'zip',
    };

    const key = map[extension] || 'file';
    return `${CDN}${key}.svg`;
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
              accept="application/pdf,image/*,text/plain,application/json,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,video/mp4,video/webm,audio/mpeg,audio/wav"
              className="hidden"
            />
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

          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-300">User: <span className="font-semibold">{this.state.userName}</span>{this.state.isEditor && <span className="ml-2 text-green-400">(edit)</span>}</div>
            {this.state.isEditor ? (
              <button
                onClick={() => this.setState({ isEditor: false, userName: `guest-${Math.floor(1000 + Math.random()*9000)}` })}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => this.setState({ showLoginDialog: true, loginInput: '' })}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
              >
                Login
              </button>
            )}

        {/* Login Modal */}
        {this.state.showLoginDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center" onClick={() => this.setState({ showLoginDialog: false, loginInput: '', loginError: '' })}>
            <div className="bg-ub-cool-grey border border-gray-700 rounded-lg p-5 w-96" onClick={(e) => e.stopPropagation()}>
              <div className="text-lg font-semibold mb-2">Login</div>
              <div className="text-xs text-gray-400 mb-3">Enter password to switch to editor mode (user: helmi).</div>
              <input
                type="password"
                value={this.state.loginInput}
                onChange={(e) => this.setState({ loginInput: e.target.value })}
                className="w-full px-3 py-2 bg-ub-grey border border-gray-600 rounded outline-none focus:border-ubb-orange mb-2"
                placeholder="Password"
                autoFocus
              />
              {this.state.loginError && <div className="text-xs text-red-400 mb-2">{this.state.loginError}</div>}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => this.setState({ showLoginDialog: false, loginInput: '', loginError: '' })}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const pwd = this.state.loginInput;
                    const expected = process.env.NEXT_PUBLIC_THOUGHTS_PASSWORD;
                    if (pwd && expected && pwd === expected) {
                      this.setState({ isEditor: true, userName: 'helmi', showLoginDialog: false, loginInput: '', loginError: '' });
                    } else {
                      this.setState({ loginError: 'Incorrect password' });
                    }
                  }}
                  className="px-3 py-1 bg-ubb-orange hover:bg-orange-600 rounded text-xs"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
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

        {/* Delete Confirmation Modal */}
        {this.state.showDeleteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => this.setState({ showDeleteDialog: false, deleteTargetName: null })}>
            <div className="bg-ub-cool-grey border border-gray-700 rounded-lg w-96 p-4" onClick={(e) => e.stopPropagation()}>
              <div className="text-lg font-semibold mb-2">Delete item</div>
              <div className="text-sm text-gray-300 mb-4">
                Are you sure you want to delete <span className="font-semibold">{this.state.deleteTargetName}</span>?
                This will remove it from your site and from storage if applicable.
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => this.setState({ showDeleteDialog: false, deleteTargetName: null })}
                  className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const target = this.state.deleteTargetName;
                    this.setState({ showDeleteDialog: false, deleteTargetName: null });
                    if (target) await this.deleteItem(target);
                  }}
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Viewer Modal */}
        {this.state.showViewer && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => this.setState({ showViewer: false })}>
            <div className="bg-ub-cool-grey border border-gray-700 rounded-lg w-11/12 h-5/6 flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                <div className="font-semibold truncate pr-2">{this.state.viewerTitle}</div>
                <button onClick={() => this.setState({ showViewer: false })} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">Close</button>
              </div>
              <div className="flex-1 overflow-auto bg-gray-900">
                {(() => {
                  const mime = this.state.viewerMime;
                  const url = this.state.viewerUrl;
                  const name = this.state.viewerTitle || '';
                  const lowerName = name.toLowerCase();
                  const isPDF = mime === 'application/pdf' || lowerName.endsWith('.pdf');
                  const isImage = mime.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(lowerName);
                  const isVideo = mime.startsWith('video/') || /\.(mp4|webm|ogg)$/i.test(lowerName);
                  const isAudio = mime.startsWith('audio/') || /\.(mp3|wav|ogg)$/i.test(lowerName);
                  const isText = (
                    mime.startsWith('text/') ||
                    /(dockerfile|makefile)$/i.test(lowerName) ||
                    /\.(txt|md|lock|gitignore|env|npmrc|editorconfig|prettierrc|eslintrc|ini|conf|toml)$/i.test(lowerName)
                  );
                  const isCode = /\.(js|jsx|ts|tsx|py|java|c|cpp|css|html)$/i.test(lowerName) || mime === 'application/json';
                  const isDocx = mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || /\.docx$/i.test(lowerName);
                  const isDoc = mime === 'application/msword' || /\.doc$/i.test(lowerName);
                  const isPptx = mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || /\.pptx$/i.test(lowerName);
                  const isXlsx = mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || /\.xlsx$/i.test(lowerName);

                  // Office viewers (require public URL)
                  if (isDoc || isDocx || isPptx || isXlsx) {
                    const encoded = encodeURIComponent(url);
                    const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encoded}`;
                    return (
                      <iframe title="office-viewer" src={officeUrl} className="w-full h-full border-0" />
                    );
                  }

                  if (isPDF) {
                    return (
                      <iframe title="pdf-viewer" src={url} className="w-full h-full border-0" />
                    );
                  }

                  if (isImage) {
                    return (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <img src={url} alt={name} className="max-w-full max-h-full object-contain" />
                      </div>
                    );
                  }

                  if (isVideo) {
                    return (
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <video controls src={url} className="max-w-full max-h-full" />
                      </div>
                    );
                  }

                  if (isAudio) {
                    return (
                      <div className="p-4">
                        <audio controls src={url} className="w-full" />
                      </div>
                    );
                  }

                  if (isText || isCode) {
                    const extensions = [oneDark, highlightSelectionMatches(), ...this.getCodeExtensions(name, mime)];
                    const onCopy = async () => {
                      try { await navigator.clipboard.writeText(this.state.viewerText || ''); } catch {}
                      this.setState({ copyMsg: 'Copied' });
                      setTimeout(() => this.setState({ copyMsg: '' }), 1200);
                    };
                    return (
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                          <div className="text-xs text-gray-400">Press Ctrl/Cmd+F to search</div>
                          <div className="flex items-center gap-2">
                            {this.state.copyMsg && <span className="text-xs text-green-400">{this.state.copyMsg}</span>}
                            <button onClick={onCopy} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">Copy</button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <CodeMirror
                            value={this.state.viewerText || ''}
                            height="100%"
                            theme={oneDark}
                            extensions={extensions}
                            editable={false}
                            basicSetup={{ lineNumbers: true, highlightActiveLine: true, scrollPastEnd: true, foldGutter: true, searchKeymap }}
                          />
                        </div>
                      </div>
                    );
                  }

                  // Fallback: show download link
                  return (
                    <div className="p-4 text-sm">
                      <p>Preview not supported for this file type.</p>
                      <a href={url} target="_blank" rel="noreferrer" className="text-ubb-orange underline">Open in new tab</a>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Uploading overlay */}
        {this.state.isUploading && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-ub-cool-grey border border-gray-700 rounded px-4 py-3 text-sm">
              {this.state.uploadingLabel || 'Uploading...'}
            </div>
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
                  {this.state.isEditor ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => this.setState({ showNewFolderDialog: true, dialogValue: "" })}
                        className="px-3 py-1 bg-ubb-orange hover:bg-orange-600 rounded text-sm"
                        title="New folder"
                      >
                        + Folder
                      </button>
                      <button
                        onClick={() => this.fileInputRef.current?.click()}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                        title="Upload file"
                      >
                        Upload
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">Read-only mode</div>
                  )}
                </div>

                {this.state.isLoadingFolder ? (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ubb-orange mr-3"></div>
                    Loading folder...
                  </div>
                ) : items.length === 0 ? (
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

        {/* Context Menu (items only) */}
        {this.state.showContextMenu && this.state.contextMenuType === "item" && (
          <div
            className="fixed bg-ub-cool-grey border border-gray-700 rounded shadow-lg py-1 z-50"
            style={{ left: this.state.contextMenuPos.x, top: this.state.contextMenuPos.y }}
            onClick={(e) => e.stopPropagation()}
          >
            {this.state.isEditor && (
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
                    const target = this.state.selectedItems[0];
                    this.setState({ showContextMenu: false, showDeleteDialog: true, deleteTargetName: target });
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
