class Solution {
    public int[] twoSum(int[] nums, int target) {

       Map<Integer, Integer> solution = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {

            int com = target - nums[i];

            if (solution.containsKey(com)) {
                return new int[]{solution.get(com), i};
            }

            solution.put(nums[i], i);
        }

        return new int[]{};
    }
}
