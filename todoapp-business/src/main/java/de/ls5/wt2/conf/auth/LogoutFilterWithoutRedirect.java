package de.ls5.wt2.conf.auth;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.web.filter.authc.LogoutFilter;
import org.apache.shiro.web.util.WebUtils;

public class LogoutFilterWithoutRedirect extends LogoutFilter {
    @Override
    protected boolean preHandle(ServletRequest request, ServletResponse response) throws Exception {
        HttpServletResponse httpServletResponse = WebUtils.toHttp(response);
        httpServletResponse.setStatus(200);
        httpServletResponse.setHeader("Set-Cookie", "JSESSIONID=EMPTY; expires=Thu, 01 Jan 1970 00:00:00 GMT");

        return super.preHandle(request, httpServletResponse);
    }

    @Override
    protected void issueRedirect(ServletRequest request, ServletResponse response, String redirectUrl) {
        // do not redirect
    }
}
