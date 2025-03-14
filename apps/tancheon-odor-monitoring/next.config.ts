import type { NextConfig } from "next";
import path from "path";
import CopyWebpackPlugin from "copy-webpack-plugin";
import fs from "fs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        pathname: '/img/wn/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // 클라이언트 사이드에서만 실행
    if (!isServer) {
      // Cesium 패키지 경로 찾기 (여러 가능한 경로 시도)
      let cesiumPath;
      
      try {
        // 1. 현재 앱의 node_modules에서 찾기
        const appNodeModulesPath = path.resolve(__dirname, 'node_modules/cesium');
        if (fs.existsSync(path.join(appNodeModulesPath, 'package.json'))) {
          cesiumPath = appNodeModulesPath;
        } 
        // 2. 루트 node_modules에서 찾기
        else {
          const rootNodeModulesPath = path.resolve(process.cwd(), '../../node_modules/cesium');
          if (fs.existsSync(path.join(rootNodeModulesPath, 'package.json'))) {
            cesiumPath = rootNodeModulesPath;
          }
          // 3. require.resolve로 찾기
          else {
            cesiumPath = path.dirname(require.resolve('cesium/package.json'));
          }
        }
        
        console.log('Cesium 패키지 경로:', cesiumPath);
        
        // Cesium 정적 파일을 public/cesium 폴더로 복사
        config.plugins.push(
          new CopyWebpackPlugin({
            patterns: [
              {
                from: path.join(cesiumPath, 'Build/Cesium'),
                to: 'static/cesium',
              },
            ],
          })
        );
      } catch (error) {
        console.error('Cesium 패키지를 찾을 수 없습니다:', error);
      }
    }
    
    return config;
  },
};

export default nextConfig;
