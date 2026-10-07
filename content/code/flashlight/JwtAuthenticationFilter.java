@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;


    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        try {
            String tk = jwtService.extractAccesTk(request);

            if (tk != null) {

                UserDetails userDetails = jwtService.validateTk(tk);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());

                // We need to do this, so that every other filter and controller knows if the
                // current user that issued the request is already authenticated.
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // After this we are able to directly access this attribute to get a user f.e,
                // resulting in less code
                if (userDetails instanceof CustomUserDetails) {
                    request.setAttribute("userId", ((CustomUserDetails) userDetails).getId());
                }

            }
        } catch (Exception ex) {
            log.warn("Received invalid auth token");
        }

        // Calls the next filter in the chain
        filterChain.doFilter(request, response);
    }

}
