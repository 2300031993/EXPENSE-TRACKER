import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Settings({ onExportData, onImportData, onClearData }) {
	const { user, logout } = useAuth();
	const [file, setFile] = useState(null);
	const [confirm, setConfirm] = useState(false);

	return (
		<div className="settings-page">
			<div className="page-header"><h1>Settings</h1><p>Manage your account and preferences</p></div>

			<div className="settings-section">
				<h3>Profile Information</h3>
				<div className="profile-card">
					<div className="profile-info">
						<div className="profile-avatar">{(user?.name||'U').charAt(0).toUpperCase()}</div>
						<div className="profile-details">
							<h4>{user?.name||'User'}</h4>
							<p>{user?.email||''}</p>
							<span className="member-since">Member since {user?.createdAt? new Date(user.createdAt).toLocaleDateString(): 'today'}</span>
						</div>
					</div>
					<button className="logout-btn" onClick={logout}>Logout</button>
				</div>
			</div>

			<div className="settings-section">
				<h3>Data Management</h3>
				<div className="data-management">
					<div className="data-card"><div className="data-icon">📤</div><div className="data-content"><h4>Export Data</h4><p>Download your expenses as JSON</p><button className="data-btn" onClick={onExportData}>Export Data</button></div></div>
					<div className="data-card"><div className="data-icon">📥</div><div className="data-content"><h4>Import Data</h4><p>Import expenses from JSON</p><div className="import-section"><input id="file" className="file-input" type="file" accept=".json" onChange={(e)=>setFile(e.target.files?.[0]||null)} /><label className="file-label" htmlFor="file">Choose File</label>{file && <button className="import-btn" onClick={()=>onImportData(file)}>Import {file.name}</button>}</div></div></div>
					<div className="data-card"><div className="data-icon">🗑️</div><div className="data-content"><h4>Clear All Data</h4><p>Permanently delete all your expenses</p><button className="clear-btn" onClick={()=>setConfirm(true)}>Clear All Data</button></div></div>
				</div>
			</div>

			{confirm && (
				<div className="modal-overlay"><div className="modal"><h3>Clear All Data</h3><p>This action cannot be undone. Proceed?</p><div className="modal-actions"><button className="cancel-btn" onClick={()=>setConfirm(false)}>Cancel</button><button className="confirm-btn" onClick={()=>{onClearData(); setConfirm(false);}}>Yes, clear</button></div></div></div>
			)}
		</div>
	);
}
