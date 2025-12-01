export default async function (modulePath) {
  try {
    if (!existsSync(modulePath)) {
      return {}
    }
    const configModule = await import(modulePath)
    return configModule.default || configModule || {}
  } catch (error) {
    console.warn(
      `-[MvpConfigManager]- Could not load module \n
      ${modulePath}
      ${error.message}`,
    )

    return {}
  }
}
