plugins { id("com.android.application") }
android {
  namespace = "fr.momentum.sport"
  compileSdk = 35
  defaultConfig {
    applicationId = "fr.momentum.sport.clean"
    minSdk = 26
    targetSdk = 34
    versionCode = 138
    versionName = "1.3.8"
  }
  buildTypes { release { isMinifyEnabled = false } }
  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }
}
