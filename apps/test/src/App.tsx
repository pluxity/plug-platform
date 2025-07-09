import { useState } from 'react';
import RoleTest from './components/RoleTest';
import BuildingTest from "./components/BuildingTest.tsx";
import UserTest from "./components/UserTest.tsx";
import AuthTest from "./components/AuthTest.tsx";

function App() {
  const [activeTab, setActiveTab] = useState<string>('auth');

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>API 훅 테스트 애플리케이션</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('auth')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'auth' ? '#4CAF50' : '#f1f1f1',
            color: activeTab === 'auth' ? 'white' : 'black',
            border: 'none',
            marginRight: '10px',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          인증 API
      </button>
        <button 
          onClick={() => setActiveTab('user')}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: activeTab === 'user' ? '#4CAF50' : '#f1f1f1',
            color: activeTab === 'user' ? 'white' : 'black',
            border: 'none',
            marginRight: '10px',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          유저 API
        </button>
        <button 
          onClick={() => setActiveTab('building')}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: activeTab === 'building' ? '#4CAF50' : '#f1f1f1',
            color: activeTab === 'building' ? 'white' : 'black',
            border: 'none',
            marginRight: '10px',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          빌딩 API
        </button>
        <button 
          onClick={() => setActiveTab('role')}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: activeTab === 'role' ? '#4CAF50' : '#f1f1f1',
            color: activeTab === 'role' ? 'white' : 'black',
            border: 'none',
            marginRight: '10px',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          역할 API
        </button>
      </div>
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
        {activeTab === 'auth' && <AuthTest />}
        {activeTab === 'role' && <RoleTest />}
        {activeTab === 'user' && <UserTest />}
        {activeTab === 'building' && <BuildingTest />}
      </div>
    </div>
  );
}

export default App;