import java.util.ArrayList;

public class Example {

    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<Integer>();
        numbers.add(5);
        numbers.add(9);
        numbers.add(8);
        numbers.add(1);

        if (numbers.size() > 0) { // 1
            // line comment
            // line comment
            /*
             * block comment
             * 
             * 
             */
            numbers.add(1);
        }

        numbers.forEach((n) -> {
            System.out.println(n);
        });
    }

    public static void abc() throws Exception {
        // 123
        // 123
        int i = 1;
        System.out.println(i);
    }

}