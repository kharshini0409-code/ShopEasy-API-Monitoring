package com.apimonitor.api_monitor.controller;

import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apimonitor.api_monitor.service.ApiGatewayService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/gateway")
public class ApiGatewayController {
    private final ApiGatewayService apiGatewayService;

    public ApiGatewayController(ApiGatewayService apiGatewayService) {
        this.apiGatewayService = apiGatewayService;
    }

    // Supports /gateway/{apiId} and /gateway/{apiId}/any/target/path?query=value.
    @RequestMapping({"/{apiId}", "/{apiId}/**"})
    public ResponseEntity<byte[]> forwardRequest(
            @PathVariable Long apiId,
            @RequestBody(required = false) byte[] requestBody,
            HttpServletRequest request) {

        HttpMethod method = HttpMethod.valueOf(request.getMethod().toUpperCase());
        String prefix = request.getContextPath() + "/gateway/" + apiId;
        String requestUri = request.getRequestURI();
        String targetPath = requestUri.startsWith(prefix) ? requestUri.substring(prefix.length()) : "";
        if (targetPath.isBlank()) targetPath = "/";
        String query = request.getQueryString();
        String pathAndQuery = targetPath + (query == null || query.isBlank() ? "" : "?" + query);

        Map<String, String> headers = new LinkedHashMap<>();
        Enumeration<String> names = request.getHeaderNames();
        while (names != null && names.hasMoreElements()) {
            String name = names.nextElement();
            if (!name.equalsIgnoreCase("host") && !name.equalsIgnoreCase("content-length")
                    && !name.equalsIgnoreCase("connection") && !name.equalsIgnoreCase("accept-encoding")
                    && !name.equalsIgnoreCase("origin") && !name.toLowerCase().startsWith("access-control-")) {
                headers.put(name, request.getHeader(name));
            }
        }

        return apiGatewayService.forwardRequest(apiId, method, requestBody, request.getRemoteAddr(), pathAndQuery, headers);
    }
}
