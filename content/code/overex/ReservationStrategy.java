/** One interface, four implementations — switchable per load test. */
public interface ReservationStrategy {
    ReservationResult reserve(UUID eventId, UUID orderId, int qty);
}

@Component
@ConditionalOnProperty(name = "overex.strategy", havingValue = "pessimistic")
@RequiredArgsConstructor
class PessimisticLockStrategy implements ReservationStrategy {

    private final InventoryRepository inventory;

    @Override
    @Transactional
    public ReservationResult reserve(UUID eventId, UUID orderId, int qty) {
        // SELECT … FOR UPDATE — other buyers wait for the row lock
        Inventory row = inventory.findByEventIdForUpdate(eventId);
        if (row.remaining() < qty) return ReservationResult.soldOut();
        row.decrement(qty);
        return ReservationResult.ok(row.remaining());
    }
}
