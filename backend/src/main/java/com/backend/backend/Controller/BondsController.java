package com.backend.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.backend.Entity.Bonds;
import com.backend.backend.Service.BondsService;
import com.backend.backend.Constants.Constants;
import java.util.List;

@RestController
public class BondsController {

    @Autowired
    private BondsService bondsService;

    @GetMapping(Constants.BONDS_ROUTE)
    @CrossOrigin(origins = Constants.CORS_ORIGIN)
    public List<Bonds> getAllBonds() {
        return bondsService.getAllBonds();
    }
}

