@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private JwtService jwtService;

    @Value("${FRONTEND_URL:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                // with this, we are actually able to read the header more conveniently
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    
                    // 1. Receive the tk
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String tk = authHeader.substring(7);
                        
                        // 2. Validate Tk
                        UserDetails userDetails = jwtService.validateTk(tk);

                        if (userDetails != null) {
                           
                            UsernamePasswordAuthenticationToken auth = 
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                            
                            // 3. Writing the auth instance into the session
                            accessor.setUser(auth);
                        }
                    }
                }
                return message;
            }
        });
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a memory-based message broker
        // /queue: for private messages (one-to-one)
        config.enableSimpleBroker( "/queue");

        // Prefix for messages bound for methods annotated with @MessageMapping
        config.setApplicationDestinationPrefixes("/app");

        // Prefix for user-specific destinations (private messaging)
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

          List<String> allowedOrigins = Stream.of(frontendUrl.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        // The URL where the client connects to the WebSocket server
      registry.addEndpoint("/ws")
            .setAllowedOriginPatterns(allowedOrigins.toArray(new String[0])); // CORS for Next.js
    }
}