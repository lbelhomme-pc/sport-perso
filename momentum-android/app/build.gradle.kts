plugins { id("com.android.application") }
android {
  namespace = "fr.momentum.sport"
  compileSdk = 35
  defaultConfig {
    applicationId = "fr.momentum.sport.shortcuts"
    minSdk = 26
    targetSdk = 34
    versionCode = 142
    versionName = "1.4.2"
  }
  buildTypes { release { isMinifyEnabled = false } }
  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }
}
