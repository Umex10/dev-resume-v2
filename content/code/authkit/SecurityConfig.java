@Configuration
@EnableWebSecurity
@EnableMethodSecurity // enables @PreAuthorize("hasRole('ADMIN')") and friends
public class SecurityConfig {

    /**
     * Stops Spring Boot from auto-registering {@link JwtAuthFilter} as a global
     * servlet filter.
     *
     * <p>Because the filter is also a {@code @Bean}, Boot would otherwise wire it
     * into the raw servlet filter chain <i>in addition</i> to the Spring Security
     * chain, making it run twice. On the duplicate run the security chain's
     * {@code SecurityContextHolderFilter} resets the context and the request ends
     * up anonymous. Disabling the auto-registration guarantees the filter runs
     * exactly once — inside the security chain, where we placed it.
     *
     * @return a disabled filter registration for the JWT filter
     */
    @Bean
    public FilterRegistrationBean<JwtAuthFilter> jwtAuthFilterRegistration(JwtAuthFilter filter) {
        FilterRegistrationBean<JwtAuthFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
            JwtAuthFilter jwtAuthenticationFilter) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable()) // safe: the API is stateless and token-based, not cookie-session-based
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // CORS pre-flight
                .requestMatchers("/auth/**").permitAll()                // public: sign-up / sign-in / refresh
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll() // public docs
                .anyRequest().authenticated())                          // everything else needs a valid JWT
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
