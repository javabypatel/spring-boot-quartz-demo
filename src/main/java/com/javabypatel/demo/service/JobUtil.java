package com.javabypatel.demo.service;

import java.text.ParseException;
import java.util.Date;

import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.Trigger;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.quartz.JobDetailFactoryBean;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.scheduling.quartz.SimpleTriggerFactoryBean;

import com.javabypatel.demo.config.PersistableCronTriggerFactoryBean;

class JobUtil {
	
	/**
	 * Create Quartz Job.
	 * 
	 * @param jobClass Class whose executeInternal() method needs to be called. 
	 * @param isDurable Job needs to be persisted even after completion. if true, job will be persisted, not otherwise. 
	 * @param context Spring application context.
	 * @param jobName Job name.
	 * @param jobGroup Job group.
	 * 
	 * @return JobDetail object
	 */
	protected static JobDetail createJob(Class<? extends QuartzJobBean> jobClass, boolean isDurable, 
			ApplicationContext context, String jobName, String jobGroup){
	    JobDetailFactoryBean factoryBean = new JobDetailFactoryBean();
	    factoryBean.setJobClass(jobClass);
	    factoryBean.setDurability(isDurable);
	    factoryBean.setApplicationContext(context);
	    factoryBean.setName(jobName);
	    factoryBean.setGroup(jobGroup);
        
	    // set job data map
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("myKey", "myValue");
        factoryBean.setJobDataMap(jobDataMap);
        
        factoryBean.afterPropertiesSet();
        
	    return factoryBean.getObject();
	}

	/**
	 * Create cron trigger. 
	 * 
	 * @param triggerName Trigger name.
	 * @param startTime Trigger start time.
	 * @param cronExpression Cron expression.
	 * @param misFireInstruction Misfire instruction (what to do in case of misfire happens).
	 *  
	 * @return Trigger
	 */
	protected static Trigger createCronTrigger(String triggerName, Date startTime, String cronExpression, int misFireInstruction){
		PersistableCronTriggerFactoryBean factoryBean = new PersistableCronTriggerFactoryBean();
	    factoryBean.setName(triggerName);
	    factoryBean.setStartTime(startTime);
	    factoryBean.setCronExpression(cronExpression);
	    factoryBean.setMisfireInstruction(misFireInstruction);
	    try {
	        factoryBean.afterPropertiesSet();
	    } catch (ParseException e) {
	        e.printStackTrace();
	    }
	    return factoryBean.getObject();
	}
	
	/**
	 * Create a Single trigger.
	 * 
	 * @param triggerName Trigger name.
	 * @param startTime Trigger start time.
	 * @param misFireInstruction Misfire instruction (what to do in case of misfire happens).
	 * 
	 * @return Trigger
	 */
	protected static Trigger createSingleTrigger(String triggerName, Date startTime, int misFireInstruction){
		SimpleTriggerFactoryBean factoryBean = new SimpleTriggerFactoryBean();
	    factoryBean.setName(triggerName);
	    factoryBean.setStartTime(startTime);
	    factoryBean.setMisfireInstruction(misFireInstruction);
	    factoryBean.setRepeatCount(0);
	    factoryBean.afterPropertiesSet();
	    return factoryBean.getObject();
	}
	
}
