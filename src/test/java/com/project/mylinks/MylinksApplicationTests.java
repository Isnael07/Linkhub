package com.project.mylinks;

import com.project.mylinks.config.TestRestClientConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestRestClientConfig.class)
class MylinksApplicationTests {

	@Test
	void contextLoads() {
	}

}
