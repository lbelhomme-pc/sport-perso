plugins { id("com.android.application") }
android {
  namespace = "fr.momentum.sport"
  compileSdk = 35
  defaultConfig {
    applicationId = "fr.momentum.sport.garmin"
    minSdk = 26
    targetSdk = 34
    versionCode = 150
    versionName = "1.5.0"
  }
  buildTypes { release { isMinifyEnabled = false } }
  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }
}
