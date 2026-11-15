/*
 * ShopEasy -> API Monitoring configuration.
 * Register ShopEasy as a Monitored API in the monitoring dashboard:
 *   Name: ShopEasy Backend
 *   Target URL: http://localhost:8081
 * Then replace API_ID below with the ID returned by the dashboard.
 */
window.SHOP_EASY_MONITORING = Object.freeze({
    GATEWAY_BASE_URL: "http://localhost:8080/gateway",
    API_ID: 4,
    ENABLED: true
});
