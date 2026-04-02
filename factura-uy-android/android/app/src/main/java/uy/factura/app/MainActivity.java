package uy.factura.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import net.hampoelz.capacitor.nodejs.NodeJS;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Registrar el plugin NodeJS para iniciar el backend automáticamente
        registerPlugin(NodeJS.class);
        super.onCreate(savedInstanceState);
    }
}
