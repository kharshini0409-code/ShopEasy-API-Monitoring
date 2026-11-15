/* ShopEasy monitoring bridge.
 * Existing ShopEasy pages remain intact and keep their localStorage behavior.
 * Changed data is mirrored to ShopEasy Backend through the monitored gateway.
 */
(() => {
    "use strict";

    const config = window.SHOP_EASY_MONITORING || {};
    const apiId = Number(config.API_ID || localStorage.getItem("shopEasyMonitoredApiId") || 0);
    const gateway = String(config.GATEWAY_BASE_URL || "http://localhost:8080/gateway").replace(/\/$/, "");
    const enabled = config.ENABLED !== false;

    const resourceMap = {
        users: "customers",
        shopEasyProducts: "products",
        cart: "cart",
        wishlist: "wishlist",
        orders: "orders",
        reviews: "reviews",
        loggedInUser: "current-session",
        lastOrder: "latest-order",
        adminSession: "admin-session"
    };

    if (!enabled || !apiId) {
        console.info("ShopEasy monitoring bridge is ready. Set API_ID in js/integration-config.js after registering the backend.");
        return;
    }

    const endpoint = `${gateway}/${apiId}/api/integration`;

    function redactSensitiveFields(value) {
        if (Array.isArray(value)) return value.map(redactSensitiveFields);
        if (value && typeof value === "object") {
            const safe = {};
            Object.entries(value).forEach(([key, item]) => {
                safe[key] = /password|passwd|secret|token/i.test(key) ? "[REDACTED]" : redactSensitiveFields(item);
            });
            return safe;
        }
        return value;
    }

    function parseStoredValue(raw) {
        try { return JSON.parse(raw); }
        catch { return raw; }
    }

    async function sendEvent(eventType, resource, details = {}) {
        try {
            const response = await fetch(`${endpoint}/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ eventType, resource, page: location.pathname, details, occurredAt: new Date().toISOString() })
            });
            if (!response.ok) console.warn(`ShopEasy monitoring event failed: HTTP ${response.status}`);
        } catch (error) {
            console.warn("ShopEasy monitoring backend is not reachable:", error.message);
        }
    }

    async function syncSnapshot(resource, payload) {
        try {
            const response = await fetch(`${endpoint}/snapshots/${encodeURIComponent(resource)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(redactSensitiveFields(payload))
            });
            if (!response.ok) console.warn(`ShopEasy ${resource} sync failed: HTTP ${response.status}`);
        } catch (error) {
            console.warn(`ShopEasy ${resource} sync could not reach the backend:`, error.message);
        }
    }

    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
        originalSetItem.call(this, key, value);
        if (this !== window.localStorage) return;
        const resource = resourceMap[key];
        if (!resource) return;
        syncSnapshot(resource, parseStoredValue(String(value)));
    };

    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function (key) {
        originalRemoveItem.call(this, key);
        if (this !== window.localStorage) return;
        const resource = resourceMap[key];
        if (!resource) return;
        fetch(`${endpoint}/snapshots/${encodeURIComponent(resource)}`, { method: "DELETE" })
            .catch(error => console.warn("ShopEasy delete sync failed:", error.message));
        sendEvent(`${resource.toUpperCase()}_CLEARED`, resource, { source: "localStorage" });
    };

    // A page-view request verifies the complete browser -> gateway -> backend route.
    sendEvent("PAGE_VIEW", "navigation", { page: location.pathname, title: document.title });

    // Expose a tiny manual diagnostic for browser-console testing.
    window.shopEasyMonitoringTest = async function () {
        const response = await fetch(`${endpoint}/health`);
        const result = await response.json();
        console.info("ShopEasy monitoring connection:", result);
        return result;
    };
})();
