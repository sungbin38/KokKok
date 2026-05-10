// Expo Config Plugin — RNFB v22 + Expo SDK 54 + useFrameworks:'static' 충돌 해결.
//
// 문제: 정적 프레임워크 모드에서 RNFB pods 가 React Core 헤더를 non-modular
// 로 import해서 컴파일 시 -Werror,-Wnon-modular-include-in-framework-module
// 또는 RCTPromiseRejectBlock 식별 불가 에러 발생.
//
// 해결:
// 1. $RNFirebaseAsStaticFramework = true (RNFB가 자체 인식, framework_module
//    구성을 정적 호환 모드로 강제)
// 2. use_modular_headers! (모든 pod 에 modular_headers 처리 → RNFB 가
//    React-Core 등 의존성을 @import 로 사용 가능)
// 3. post_install hook 으로 RNFB / GoogleSignin pods 에 ALLOW_NON_MODULAR
//    + DEFINES_MODULE 강제 — 잔여 케이스 안전망
//
// 이 plugin 이 없으면 expo prebuild 가 매번 깨끗한 Podfile 을 생성해서
// 위 패치가 사라지므로 빌드 실패.

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('node:fs');
const path = require('node:path');

const POST_INSTALL_PATCH = `
    # [with-rnfb-pod-fix] RNFB / GoogleSignin pods 에 modular header 허용
    installer.pods_project.targets.each do |t|
      if t.name.start_with?('RNFB')
        # RNFB 자체는 module 로 만들지 않는다. RNFBApp 이 module 이 되면
        # umbrella 가 <React/RCTBridgeModule.h> 를 RNFBApp.RNFBAppModule 로
        # re-export 해서, 같은 module 인 RNFBFirestore 가 #import 할 때
        # 'must be imported from module ...' strict-module 오류 발생.
        t.build_configurations.each do |bc|
          bc.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
          bc.build_settings['DEFINES_MODULE'] = 'NO'
          bc.build_settings['CLANG_ENABLE_MODULES'] = 'NO'
        end
      elsif t.name.start_with?('RNGoogleSignin') || t.name.start_with?('Firebase') || t.name.start_with?('Google') || t.name.start_with?('gRPC') || t.name.start_with?('BoringSSL') || t.name.start_with?('abseil') || t.name.start_with?('leveldb') || t.name.start_with?('GoogleUtilities')
        t.build_configurations.each do |bc|
          bc.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
          bc.build_settings['DEFINES_MODULE'] = 'YES'
        end
      end
    end
`;

function patchPodfile(contents) {
  let out = contents;

  // 1. $RNFirebaseAsStaticFramework = true 를 최상단에 (require 문 직전).
  if (!out.includes('$RNFirebaseAsStaticFramework')) {
    out = out.replace(
      /^require/m,
      "$RNFirebaseAsStaticFramework = true\n\nrequire",
    );
  }

  // 2. use_modular_headers! 를 use_expo_modules! 다음 줄에 추가.
  if (!out.includes('use_modular_headers!')) {
    out = out.replace(
      /use_expo_modules!\n/,
      "use_expo_modules!\n  use_modular_headers!\n",
    );
  }

  // 3. react_native_post_install(...) 호출 직후에 패치 hook 삽입.
  if (!out.includes('with-rnfb-pod-fix')) {
    out = out.replace(
      /(react_native_post_install\([\s\S]*?\)\n)/,
      `$1${POST_INSTALL_PATCH}`,
    );
  }

  return out;
}

const withRNFBPodFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const podfilePath = path.join(
        cfg.modRequest.platformProjectRoot,
        'Podfile',
      );
      if (!fs.existsSync(podfilePath)) {
        return cfg;
      }
      const original = fs.readFileSync(podfilePath, 'utf-8');
      const patched = patchPodfile(original);
      if (patched !== original) {
        fs.writeFileSync(podfilePath, patched);
      }
      return cfg;
    },
  ]);
};

module.exports = withRNFBPodFix;
