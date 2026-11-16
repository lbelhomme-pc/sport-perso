plugins { id("com.android.application") }
android {
  namespace = "fr.momentum.sport"
  compileSdk = 35
  defaultConfig {
    applicationId = "fr.momentum.sport.clean"
    minSdk = 26
    targetSdk = 34
    versionCode = 139
    versionName = "1.3.9"
  }
  buildTypes { release { isMinifyEnabled = false } }
  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }
}
