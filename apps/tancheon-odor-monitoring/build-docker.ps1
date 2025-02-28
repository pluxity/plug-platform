# 임시 디렉토리 생성
$tempDir = "docker-build-temp"
New-Item -ItemType Directory -Force -Path $tempDir

# 필요한 파일만 복사
Write-Host "필요한 파일 복사 중..."
Copy-Item pnpm-workspace.yaml $tempDir/
Copy-Item package.json $tempDir/
Copy-Item pnpm-lock.yaml $tempDir/

# 앱 디렉토리 생성 및 파일 복사
New-Item -ItemType Directory -Force -Path "$tempDir/apps/tancheon-odor-monitoring"
Copy-Item -Recurse -Force apps/tancheon-odor-monitoring/* "$tempDir/apps/tancheon-odor-monitoring/"

# UI 패키지 디렉토리 생성 및 파일 복사
New-Item -ItemType Directory -Force -Path "$tempDir/packages/ui"
Copy-Item -Recurse -Force packages/ui/* "$tempDir/packages/ui/"

# tsconfig.json 복사
Copy-Item tsconfig.json $tempDir/

# Dockerfile 복사
Copy-Item apps/tancheon-odor-monitoring/Dockerfile $tempDir/

# 현재 디렉토리 저장
$currentDir = Get-Location

# 임시 디렉토리로 이동
Set-Location $tempDir

# Docker 빌드 실행
Write-Host "Docker 빌드 실행 중..."
docker build -t tancheon-app -f Dockerfile .

# 원래 디렉토리로 돌아가기
Set-Location $currentDir

Write-Host "빌드 완료! 다음 명령어로 실행하세요:"
Write-Host "docker run -p 3000:3000 -e JWT_SECRET=plx2025 -e DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tancheon_db tancheon-app" 