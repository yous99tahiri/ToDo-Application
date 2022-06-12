package de.ls5.wt2.Exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT, reason = " Resource Already Exists")
public class ResourceAlreadyExistsException extends RuntimeException {


    public ResourceAlreadyExistsException (String Messag){
        super(Messag);
    }

}
