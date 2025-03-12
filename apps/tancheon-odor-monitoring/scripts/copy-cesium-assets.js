const fs = require('fs-extra');
const path = require('path');

// 경로 설정
const appDir = process.cwd();
const publicCesiumPath = path.resolve(appDir, 'public/static/cesium');

// pnpm 환경에서 Cesium 패키지 경로 찾기
async function findCesiumPath() {
  // 가능한 경로들
  const possiblePaths = [
    // 1. 앱 내 node_modules에서 찾기 (일반적인 경우)
    path.resolve(appDir, 'node_modules/cesium'),
    
    // 2. pnpm store에서 찾기 (pnpm 특화)
    path.resolve(appDir, 'node_modules/.pnpm/cesium@*/node_modules/cesium'),
    
    // 3. 루트 node_modules에서 찾기 (모노레포)
    path.resolve(appDir, '../../node_modules/cesium'),
    
    // 4. 루트 pnpm store에서 찾기 (모노레포 + pnpm)
    path.resolve(appDir, '../../node_modules/.pnpm/cesium@*/node_modules/cesium')
  ];

  // 각 경로 확인
  for (const cesiumPath of possiblePaths) {
    try {
      // 디렉토리가 존재하는지 확인
      if (await fs.pathExists(path.join(cesiumPath, 'package.json'))) {
        return cesiumPath;
      }
    } catch (error) {
      console.log(`경로 확인 중 오류 발생: ${cesiumPath}`, error.message);
    }
  }

  // 5. 패턴 매칭으로 pnpm store에서 찾기
  try {
    const pnpmStoreDir = path.resolve(appDir, 'node_modules/.pnpm');
    if (await fs.pathExists(pnpmStoreDir)) {
      const dirs = await fs.readdir(pnpmStoreDir);
      const cesiumDirs = dirs.filter(dir => dir.startsWith('cesium@'));
      
      if (cesiumDirs.length > 0) {
        const cesiumPath = path.join(pnpmStoreDir, cesiumDirs[0], 'node_modules/cesium');
        if (await fs.pathExists(path.join(cesiumPath, 'package.json'))) {
          return cesiumPath;
        }
      }
    }
  } catch (error) {
    console.log('pnpm store 검색 중 오류 발생:', error.message);
  }
  
  // 경로를 찾지 못한 경우
  throw new Error('Cesium 패키지를 찾을 수 없습니다.');
}

// Cesium 에셋 복사
async function copyCesiumAssets() {
  try {
    console.log('Cesium 에셋 복사 시작...');
    
    // Cesium 패키지 경로 찾기
    const cesiumPath = await findCesiumPath();
    console.log(`Cesium 패키지 경로: ${cesiumPath}`);
    
    // 소스 경로 설정
    const sourcePath = path.join(cesiumPath, 'Build/Cesium');
    console.log(`소스 경로: ${sourcePath}`);
    
    // 대상 경로 설정
    console.log(`대상 경로: ${publicCesiumPath}`);
    
    // 소스 경로가 존재하는지 확인
    if (!(await fs.pathExists(sourcePath))) {
      throw new Error(`소스 경로가 존재하지 않습니다: ${sourcePath}`);
    }
    
    // 대상 디렉토리가 존재하는지 확인하고 없으면 생성
    await fs.ensureDir(publicCesiumPath);
    
    // Cesium 에셋 복사
    await fs.copy(sourcePath, publicCesiumPath, {
      overwrite: true,
      errorOnExist: false,
    });
    
    console.log('Cesium 에셋 복사 완료!');
  } catch (error) {
    console.error('Cesium 에셋 복사 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
copyCesiumAssets(); 